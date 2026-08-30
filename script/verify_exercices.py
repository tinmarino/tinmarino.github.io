""" Verify every exercise of the browser Python classroom.

Usage:
    python3 script/verify_exercices.py class/python-exercices

Per exercise, this checks:
  1. structure: frontmatter title, an H1, and the ``## Instructions``,
     ``## Description``, ``## Starter code``, ``## Run``, ``## Tests`` sections
  2. exactly one each of the fences ``# template``, ``# run``, ``# tests``,
     spelled exactly (a mislabelled ``# test`` is rejected, because the app
     parses these literally)
  3. house style: no ``pass``, ``# YOUR CODE HERE`` present, padded docstring,
     a doctest example, type annotations on the signature, no single-letter
     parameter names, every assert carrying an ``f"Got: ..."`` message, and
     Description headings starting at ``###``
  4. the starter template parses and runs on its own
  5. the reference solution plus the run snippet produce output
  6. the reference solution passes the tests
  7. every declared WRONG answer *fails* the tests, for the right reason, and
     every BANNED construct is both named in the Instructions and rejected by
     a wrong answer that actually uses it
  8. pylint 10/10 on the reference solution and on each self-contained
     ```python snippet, and on the ``# template`` / ``# run`` / ``# tests``
     fences under a documented per-fence exemption set
  9. no Description text -- prose *or* code -- leaks the solution

Everything an exercise needs to be verified lives in its own file, under the
``## Solution`` section: the ``# solution`` fence, two or more
``# wrong: <label>`` fences, a ``# forbidden`` fence of leak regexes and a
``# banned`` fence of constructs the student may not use. Nothing about an
individual exercise is configured here, so two exercises can never conflict.

The app never shows that section: it reads only the named fences and
``## Description``. Add ``--only ex07,ex08`` to verify a subset.
"""
import json
import pathlib
import re
import subprocess
import sys
import tempfile

QUOTES = '"""'
MAX_LINE = 100


# A line that both matches a forbidden pattern and one of these is a prohibition
# ("do not use [::-1]") or a plain mention, not a leak.
ALLOWED_CONTEXT = [
    r'do\s+(\*\*)?not(\*\*)?\s+(use|call|write)', r'forbidden', r'instead of',
    r'those\s+\*?are\*?\s+the\s+answer', r'must not', r'never use',
]

# pylint messages that are unavoidable per fence kind, and why.
FENCE_EXEMPTIONS = {
    # The body is a docstring plus a marker, so the parameter is unused, and the
    # bare docstring counts as a pointless statement.
    'template': ['unused-argument', 'pointless-string-statement'],
    # These call the function the student writes; it cannot be defined here.
    'run': ['undefined-variable'],
    # Plus __student_code__, which the app and this script inject; see
    # STUDENT_CODE_VAR below.
    'tests': ['undefined-variable'],
    # A reference solution and a wrong answer are both plain modules; a wrong
    # answer is deliberately bad Python only in the ways pylint cannot see.
    'solution': [],
}

# The tests run in the same namespace as the student's code, and are also handed
# its *source* under this name. That is what lets a test reject a banned
# construct -- `max(`, `[::-1]`, `.split(` -- which no amount of asserting on
# return values could ever catch. app.js injects the identical variable.
STUDENT_CODE_VAR = '__student_code__'

PYLINT_BASE = [
    'pylint', '--rcfile=/dev/null', '--enable=invalid-name',
    '--disable=missing-module-docstring',
    f'--additional-builtins={STUDENT_CODE_VAR}',
]

SIGNATURE_RE = re.compile(r'^def\s+(\w+)\s*\((.*?)\)\s*->\s*([^:]+?)\s*:', re.M)


def fences(markdown, kind):
    """ Return the bodies of every ```python # <kind> fence, kind matched exactly. """
    return re.findall(rf'```python[ \t]*#[ \t]*{kind}[ \t]*\n(.*?)```', markdown, re.S)


def section(markdown, name):
    """ Return the body of the ``## <name>`` section, or None. """
    match = re.search(rf'^##\s+{name}\s*$(.*?)(?=^##\s|\Z)', markdown, re.S | re.M)
    return match.group(1) if match else None


def plain_snippets(markdown):
    """ Illustrative fences that must stand alone: ```python with no marker. """
    return re.findall(r'```python[ \t]*\n(.*?)```', markdown, re.S)


def sketch_snippets(markdown):
    """ ```python # sketch``` fences.

    They call the function the student has not written yet, so they cannot be
    complete modules and are only checked for syntax.
    """
    return fences(markdown, 'sketch')


def wrong_answers(markdown):
    """ Return the (label, code) pairs of every ```python # wrong: <label> fence. """
    return re.findall(r'```python[ \t]*#[ \t]*wrong:[ \t]*(.+?)[ \t]*\n(.*?)```',
                      markdown, re.S)


def text_lines(markdown, kind):
    """ Return the non-empty, non-comment lines of a ```text # <kind> fence. """
    found = re.findall(rf'```text[ \t]*#[ \t]*{kind}[ \t]*\n(.*?)```', markdown, re.S)
    if not found:
        return None
    return [line.strip() for line in found[0].split('\n')
            if line.strip() and not line.strip().startswith('#')]


def run_tests(code, tests, relative):
    """ Exec code + tests with the source exposed, as the app does.

    Returns None on success, or the exception the tests raised. The student's
    own source is bound to __student_code__ so a test can reject a construct
    the exercise bans.
    """
    namespace = {STUDENT_CODE_VAR: code}
    try:
        exec(compile(code + '\n' + tests, relative, 'exec'), namespace)  # pylint: disable=exec-used
    except Exception as exc:                           # pylint: disable=broad-except
        return exc
    return None


def pylint_score_10(code, label, errors, exempt=()):
    """ Append to errors unless pylint rates code exactly 10.00/10. """
    args = list(PYLINT_BASE)
    args.append(f'--max-line-length={MAX_LINE}')
    if exempt:
        args.append('--disable=' + ','.join(exempt))
    with tempfile.NamedTemporaryFile('w', suffix='.py', delete=False) as handle:
        handle.write(code if code.endswith('\n') else code + '\n')
        path = handle.name
    try:
        res = subprocess.run(args + [path], capture_output=True, text=True, check=False)
        if 'rated at 10.00/10' not in res.stdout:
            msgs = [line for line in res.stdout.splitlines()
                    if re.search(r':\d+:\d+: [A-Z]\d{4}:', line)]
            detail = '\n      '.join(msgs) or res.stdout.strip()
            errors.append(f'{label}: pylint not 10/10\n      {detail}')
    finally:
        pathlib.Path(path).unlink()


def check_structure(tag, markdown, errors):
    """ Check the frontmatter, the H1 and the required H2 sections. """
    if not re.match(r'^---\n(?:.*\n)*?---\n', markdown):
        errors.append(f'{tag}: missing YAML frontmatter')
    elif not re.search(r'^title:\s*\S', markdown, re.M):
        errors.append(f'{tag}: frontmatter has no title')
    if not re.search(r'^#\s+\S', markdown, re.M):
        errors.append(f'{tag}: missing the H1 heading')
    for name in ('Instructions', 'Description', 'Starter code', 'Run', 'Tests'):
        if section(markdown, re.escape(name)) is None:
            errors.append(f'{tag}: missing "## {name}" section')


def check_signature(tag, template, errors):
    """ Check the template's `def name(arg: type) -> annotation:` line. """
    signature = SIGNATURE_RE.search(template)
    if not signature:
        errors.append(f'{tag}: template needs `def name(...) -> annotation:` with a return annotation')
        return
    name, params, _ = signature.groups()
    for param in [p.strip() for p in params.split(',') if p.strip()]:
        if ':' not in param:
            errors.append(f'{tag}: parameter "{param}" of {name}() has no type annotation')
        elif len(param.split(':')[0].strip()) < 2:
            errors.append(f'{tag}: parameter "{param}" is a single letter; use a real name')


def check_style(tag, markdown, blocks, errors):
    """ Check the house-style rules that do not need to run any code. """
    template, tests = blocks['template'], blocks['tests']

    if re.search(r'^\s+pass\s*$', template, re.M):
        errors.append(f'{tag}: template must not contain `pass`')
    if '# YOUR CODE HERE' not in template:
        errors.append(f'{tag}: template must carry the `# YOUR CODE HERE` marker')
    if not re.search(QUOTES + r'\s\S', template):
        errors.append(f'{tag}: docstring must be padded with spaces inside the quotes')
    if '>>>' not in template:
        errors.append(f'{tag}: docstring must carry a doctest example')

    check_signature(tag, template, errors)

    # Join backslash continuations so a message on the next line still counts
    joined = re.sub(r'\\\n\s*', ' ', tests)
    asserts = re.findall(r'^\s*assert\b.*$', joined, re.M)
    if not asserts:
        errors.append(f'{tag}: tests contain no assert')
    for line in asserts:
        if 'Got:' not in line:
            errors.append(f'{tag}: assert without an f"Got: ..." message: {line.strip()[:70]}')
    if not re.search(r'print\("All tests passed!"\)\s*$', tests.rstrip() + '\n'):
        errors.append(f'{tag}: tests must END with print("All tests passed!")')

    description = section(markdown, 'Description')
    if description and not re.search(r'^###\s+\S', description, re.M):
        errors.append(f'{tag}: Description needs headings starting at h3 (###)')
    return description


def check_no_leak(tag, patterns, description, errors):
    """ Check that no Description line -- prose or code -- gives the answer. """
    if description is None:
        return
    if patterns is None:
        errors.append(f'{tag}: no "```text # forbidden" fence, hints cannot be checked')
        return
    if not patterns:
        errors.append(f'{tag}: the "# forbidden" fence is empty; name the give-aways')
        return
    for line in description.split('\n'):
        if any(re.search(allow, line, re.I) for allow in ALLOWED_CONTEXT):
            continue
        for pattern in patterns:
            if re.search(pattern, line):
                errors.append(f'{tag}: Description leaks the solution (/{pattern}/)'
                              f'\n      {line.strip()[:90]}')


def check_behaviour(tag, relative, blocks, solution, errors):
    """ Run the template, the run snippet and the tests. """
    for label, code in (('template', blocks['template']),
                        ('run snippet', solution + '\n' + blocks['run'])):
        try:
            exec(compile(code, relative, 'exec'), {})  # pylint: disable=exec-used
        except Exception as exc:                       # pylint: disable=broad-except
            errors.append(f'{tag}: {label} raises: {exc!r}')

    failure = run_tests(solution, blocks['tests'], relative)
    if failure is not None:
        errors.append(f'{tag}: the reference solution FAILS its own tests: {failure!r}')


def check_wrong_answers(tag, relative, tests, wrongs, errors):
    """ Every declared wrong answer must fail the tests via an AssertionError.

    Two is the floor: one wrong answer usually only proves the tests call the
    function at all. These are the answers a student actually writes.
    """
    if len(wrongs) < 2:
        errors.append(f'{tag}: needs at least 2 "# wrong:" fences to prove the tests '
                      f'have teeth, found {len(wrongs)}')
        return
    for label, code in wrongs:
        failure = run_tests(code, tests, relative)
        if isinstance(failure, AssertionError):
            continue
        if failure is None:
            errors.append(f'{tag}: tests ACCEPT the wrong answer "{label}"')
        else:
            errors.append(f'{tag}: wrong answer "{label}" failed for the wrong reason '
                          f'({failure!r}); the tests should catch it with an assert')


def check_banned(tag, markdown, wrongs, banned, errors):
    """ Check every banned construct is announced and actually rejected.

    Naming a shortcut in the prose is not enough: a student who reaches for
    ``max(`` must be told by **Check**, not by the honour system. So each banned
    construct needs a wrong answer that really uses it, which the wrong-answer
    pass above then proves the tests reject.
    """
    if banned is None:
        errors.append(f'{tag}: no "```text # banned" fence; write an empty one if '
                      f'this exercise genuinely bans nothing')
        return
    instructions = section(markdown, 'Instructions') or ''
    wrong_code = '\n'.join(code for _, code in wrongs)
    for construct in banned:
        if construct not in instructions:
            errors.append(f'{tag}: bans "{construct}" but never says so in ## Instructions')
        if construct not in wrong_code:
            errors.append(f'{tag}: bans "{construct}" but no "# wrong:" fence uses it, '
                          f'so nothing proves the tests reject it')


def check_snippets(tag, relative, markdown, blocks, errors):
    """ Parse-check the sketches and pylint everything that can be linted. """
    for index, snippet in enumerate(sketch_snippets(markdown), start=1):
        try:
            compile(snippet, relative, 'exec')
        except SyntaxError as exc:
            errors.append(f'{tag}: sketch #{index} does not parse: {exc}')

    for kind, body in blocks.items():
        pylint_score_10(body, f'{tag} "# {kind}" fence', errors,
                        exempt=FENCE_EXEMPTIONS.get(kind, ()))
    for index, snippet in enumerate(plain_snippets(markdown), start=1):
        pylint_score_10(snippet, f'{tag} snippet #{index}', errors)


def check_exercise(base, entry, errors):
    """ Run every check for one manifest entry. """
    exercise_id, relative = entry['id'], entry['file']
    path = base / relative
    if not path.is_file():
        errors.append(f'{exercise_id}: {relative} does not exist')
        return
    markdown = path.read_text(encoding='utf-8')
    tag = f'{exercise_id} ({relative})'

    blocks = {}
    for kind in ('template', 'run', 'tests'):
        found = fences(markdown, kind)
        if len(found) != 1:
            errors.append(
                f'{tag}: expected exactly one "# {kind}" fence, found {len(found)}')
            return
        blocks[kind] = found[0]

    check_structure(tag, markdown, errors)
    if section(markdown, 'Solution') is None:
        errors.append(f'{tag}: missing "## Solution" section (solution, wrong answers, '
                      f'forbidden and banned fences); the exercise cannot be verified')
        return

    description = check_style(tag, markdown, blocks, errors)
    check_no_leak(tag, text_lines(markdown, 'forbidden'), description, errors)

    found = fences(markdown, 'solution')
    if len(found) != 1:
        errors.append(f'{tag}: expected exactly one "# solution" fence, found {len(found)}')
        return
    solution = found[0]
    blocks['solution'] = solution
    wrongs = wrong_answers(markdown)

    check_behaviour(tag, relative, blocks, solution, errors)
    check_wrong_answers(tag, relative, blocks['tests'], wrongs, errors)
    check_banned(tag, markdown, wrongs, text_lines(markdown, 'banned'), errors)
    check_snippets(tag, relative, markdown, blocks, errors)

    print('checked', tag)


def check_manifest(manifest, errors):
    """ Check the manifest's own consistency. """
    seen = set()
    for entry in manifest:
        for key in ('id', 'title', 'file'):
            if not entry.get(key):
                errors.append(f'manifest: entry {entry} has no "{key}"')
        exercise_id = entry.get('id')
        if exercise_id in seen:
            errors.append(f'manifest: duplicate id "{exercise_id}"; progress is keyed on it')
        seen.add(exercise_id)


def main(argv):
    """ Verify every exercise listed in the manifest. Return an exit status. """
    args = [a for a in argv[1:] if not a.startswith('--')]
    only = None
    for flag in argv[1:]:
        if flag.startswith('--only='):
            only = {part.strip() for part in flag.split('=', 1)[1].split(',') if part.strip()}
    if len(args) != 1:
        print(__doc__)
        return 2
    base = pathlib.Path(args[0])
    manifest = json.loads((base / 'manifest.json').read_text(encoding='utf-8'))

    errors = []
    check_manifest(manifest, errors)
    # --only verifies one exercise without needing the others to exist yet, so
    # several can be written in parallel against the same tree.
    todo = [e for e in manifest if only is None or e.get('id') in only]
    if only is not None and not todo:
        print(f'no manifest entry matches --only={",".join(sorted(only))}')
        return 2
    for entry in todo:
        check_exercise(base, entry, errors)

    print()
    if errors:
        print(f'FAILED ({len(errors)}):')
        for error in errors:
            print('  -', error)
        return 1
    print(f'ALL {len(todo)} EXERCISES OK')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
