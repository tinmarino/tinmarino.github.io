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
  7. every registered WRONG answer *fails* the tests, for the right reason
  8. pylint 10/10 on the reference solution and on each self-contained
     ```python snippet, and on the ``# template`` / ``# run`` / ``# tests``
     fences under a documented per-fence exemption set
  9. no Description text -- prose *or* code -- leaks the solution

Add to SOLUTIONS, WRONG_ANSWERS and FORBIDDEN_IN_HINTS whenever you add an
exercise: a missing entry in any of them is a hard error, not a skip.
"""
import json
import pathlib
import re
import subprocess
import sys
import tempfile

QUOTES = '"""'
MAX_LINE = 100


def _doc(text):
    """ Build a padded docstring line, the house style for these exercises. """
    return f'    {QUOTES} {text} {QUOTES}\n'


SOLUTIONS = {
    'ex00': (
        'def hello() -> str:\n'
        + _doc('Return the string "hello".')
        + '    return "hello"\n'),
    'ex01': (
        'def reverse_list(lst: list) -> list:\n'
        + _doc('Return a new list with the elements of lst reversed.')
        + '    out = []\n'
          '    for item in lst:\n'
          '        out.insert(0, item)\n'
          '    return out\n'),
    'ex02': (
        'def reverse_string(stg: str) -> str:\n'
        + _doc('Return the characters of stg in reverse order.')
        + '    out = ""\n'
          '    for char in stg:\n'
          '        out = char + out\n'
          '    return out\n'),
    'ex03': (
        'def fibo(pos: int) -> int:\n'
        + _doc('Return the Fibonacci number at position pos.')
        + '    left, right = 0, 1\n'
          '    for _ in range(pos):\n'
          '        left, right = right, left + right\n'
          '    return left\n'),
}

# Plausible-but-wrong implementations. Each MUST fail its exercise's tests.
# These are the ones a student actually writes, or that a lazy answer would use
# to game sparse test data -- not strawmen.
WRONG_ANSWERS = {
    'ex00': [
        ('prints instead of returning',
         'def hello() -> str:\n    print("hello")\n'),
        ('returns the wrong text',
         'def hello() -> str:\n    return "Hello"\n'),
    ],
    'ex01': [
        ('sorts descending instead of reversing',
         'def reverse_list(lst: list) -> list:\n    return sorted(lst, reverse=True)\n'),
        ('returns the input unchanged',
         'def reverse_list(lst: list) -> list:\n    return lst\n'),
        ('reverses the caller\'s list in place',
         'def reverse_list(lst: list) -> list:\n    lst.reverse()\n    return lst\n'),
        ('drops the first element',
         'def reverse_list(lst: list) -> list:\n'
         '    out = []\n'
         '    for item in lst[1:]:\n'
         '        out.insert(0, item)\n'
         '    return out\n'),
    ],
    'ex02': [
        ('keeps only letters',
         'def reverse_string(stg: str) -> str:\n'
         '    out = ""\n'
         '    for char in stg:\n'
         '        if char.isalpha():\n'
         '            out = char + out\n'
         '    return out\n'),
        ('concatenates in the wrong order',
         'def reverse_string(stg: str) -> str:\n'
         '    out = ""\n'
         '    for char in stg:\n'
         '        out = out + char\n'
         '    return out\n'),
        ('lowercases as a side effect',
         'def reverse_string(stg: str) -> str:\n'
         '    out = ""\n'
         '    for char in stg.lower():\n'
         '        out = char + out\n'
         '    return out\n'),
    ],
    'ex03': [
        ('lookup table of the tested positions only',
         'def fibo(pos: int) -> int:\n'
         '    return {0: 0, 1: 1, 2: 1, 5: 5, 10: 55, 20: 6765}.get(pos, 0)\n'),
        ('off by one',
         'def fibo(pos: int) -> int:\n'
         '    left, right = 0, 1\n'
         '    for _ in range(pos + 1):\n'
         '        left, right = right, left + right\n'
         '    return left\n'),
        ('starts the sequence at 1, 1',
         'def fibo(pos: int) -> int:\n'
         '    left, right = 1, 1\n'
         '    for _ in range(pos):\n'
         '        left, right = right, left + right\n'
         '    return left\n'),
    ],
}

# Text that would hand the answer away if it appeared anywhere in a Description,
# prose included. Sentences that merely *forbid* a construct are exempted by
# ALLOWED_CONTEXT below.
FORBIDDEN_IN_HINTS = {
    'ex00': [r'return\s+"hello"'],
    'ex01': [r'\[::-1\]', r'\.reverse\(\)', r'\breversed\(',
             r'for\s+\w+\s+in\s+lst\b', r'insert\(0,\s*(item|x|element)\b',
             r'out\.insert\(0'],
    'ex02': [r'\[::-1\]', r'\breversed\(',
             r'for\s+\w+\s+in\s+stg\b', r'\bout\s*=\s*char\s*\+',
             r'"c"\s*\+\s*"ab"'],
    'ex03': [r'fibo\(\s*pos\s*-', r'\+\s*fibo\(', r'range\(pos\)',
             r'right,\s*left\s*\+\s*right'],
}

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
    'tests': ['undefined-variable'],
}

PYLINT_BASE = [
    'pylint', '--rcfile=/dev/null', '--enable=invalid-name',
    '--disable=missing-module-docstring',
]

SIGNATURE_RE = re.compile(r'^def\s+(\w+)\s*\((.*?)\)\s*->\s*(\w+)\s*:', re.M)


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

    signature = SIGNATURE_RE.search(template)
    if not signature:
        errors.append(f'{tag}: template needs `def name(...) -> type:` with a return annotation')
    else:
        name, params, _ = signature.groups()
        for param in [p.strip() for p in params.split(',') if p.strip()]:
            if ':' not in param:
                errors.append(f'{tag}: parameter "{param}" of {name}() has no type annotation')
            elif len(param.split(':')[0].strip()) < 2:
                errors.append(f'{tag}: parameter "{param}" is a single letter; use a real name')

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


def check_no_leak(tag, exercise_id, description, errors):
    """ Check that no Description line -- prose or code -- gives the answer. """
    if description is None:
        return
    patterns = FORBIDDEN_IN_HINTS.get(exercise_id)
    if patterns is None:
        errors.append(f'{tag}: no FORBIDDEN_IN_HINTS entry, hints cannot be checked')
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
    cases = (
        ('template', blocks['template']),
        ('run snippet', solution + '\n' + blocks['run']),
        ('reference solution against its tests', solution + '\n' + blocks['tests']),
    )
    for label, code in cases:
        try:
            exec(compile(code, relative, 'exec'), {})  # pylint: disable=exec-used
        except Exception as exc:                       # pylint: disable=broad-except
            errors.append(f'{tag}: {label} raises: {exc!r}')


def check_wrong_answers(tag, exercise_id, relative, tests, errors):
    """ Every registered wrong answer must fail the tests via an AssertionError. """
    wrongs = WRONG_ANSWERS.get(exercise_id)
    if not wrongs:
        errors.append(f'{tag}: no WRONG_ANSWERS entry, test strength cannot be checked')
        return
    for label, code in wrongs:
        try:
            exec(compile(code + '\n' + tests, relative, 'exec'))  # pylint: disable=exec-used
        except AssertionError:
            continue
        except Exception as exc:                       # pylint: disable=broad-except
            errors.append(f'{tag}: wrong answer "{label}" failed for the wrong reason '
                          f'({exc!r}); the tests should catch it with an assert')
            continue
        errors.append(f'{tag}: tests ACCEPT the wrong answer "{label}"')


def check_snippets(tag, relative, markdown, solution, blocks, errors):
    """ Parse-check the sketches and pylint everything that can be linted. """
    for index, snippet in enumerate(sketch_snippets(markdown), start=1):
        try:
            compile(snippet, relative, 'exec')
        except SyntaxError as exc:
            errors.append(f'{tag}: sketch #{index} does not parse: {exc}')

    pylint_score_10(solution, f'{tag} reference solution', errors)
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
    description = check_style(tag, markdown, blocks, errors)
    check_no_leak(tag, exercise_id, description, errors)

    solution = SOLUTIONS.get(exercise_id)
    if solution is None:
        errors.append(f'{tag}: no SOLUTIONS entry, the exercise cannot be verified')
        return
    check_behaviour(tag, relative, blocks, solution, errors)
    check_wrong_answers(tag, exercise_id, relative, blocks['tests'], errors)
    check_snippets(tag, relative, markdown, solution, blocks, errors)

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
    if len(argv) != 2:
        print(__doc__)
        return 2
    base = pathlib.Path(argv[1])
    manifest = json.loads((base / 'manifest.json').read_text(encoding='utf-8'))

    errors = []
    check_manifest(manifest, errors)
    for entry in manifest:
        check_exercise(base, entry, errors)

    print()
    if errors:
        print(f'FAILED ({len(errors)}):')
        for error in errors:
            print('  -', error)
        return 1
    print(f'ALL {len(manifest)} EXERCISES OK')
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
