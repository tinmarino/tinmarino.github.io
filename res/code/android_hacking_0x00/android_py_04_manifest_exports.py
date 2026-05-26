#!/usr/bin/env python3

"""
Print exported Android components and deep links from an apktool manifest.

This is the Python version of the quick one-liner I keep rewriting during mobile reviews. Decode an APK with `apktool d`, then run this script against the decoded `AndroidManifest.xml`.

"""

from argparse import ArgumentParser
from pathlib import Path
from sys import exit as sys_exit
from xml.etree.ElementTree import parse as xml_parse


ANDROID_NS = "{http://schemas.android.com/apk/res/android}"
COMPONENT_TAGS = ("activity", "activity-alias", "service", "receiver", "provider")


def attr(element, name: str) -> str | None:
    """ Return the Android namespaced attribute *name*. """
    return element.get(f"{ANDROID_NS}{name}")


def intent_filters(component) -> list:
    """ Return intent-filter children for *component*. """
    return list(component.findall("intent-filter"))


def is_exported(component) -> bool:
    """ Return true when *component* is exported by flag or intent-filter. """
    exported = attr(component, "exported")
    if exported == "true":
        return True
    if exported == "false":
        return False
    return bool(intent_filters(component))


def data_rows(intent_filter) -> list[dict[str, str]]:
    """ Return data/action/category rows for one intent filter. """
    actions = [attr(action, "name") or "" for action in intent_filter.findall("action")]
    categories = [attr(category, "name") or "" for category in intent_filter.findall("category")]
    rows = []
    for data in intent_filter.findall("data"):
        rows.append({
            "scheme": attr(data, "scheme") or "",
            "host": attr(data, "host") or "",
            "port": attr(data, "port") or "",
            "path": attr(data, "path") or "",
            "pathPrefix": attr(data, "pathPrefix") or "",
            "pathPattern": attr(data, "pathPattern") or "",
            "actions": ",".join(actions),
            "categories": ",".join(categories),
        })
    if not rows:
        rows.append({
            "scheme": "",
            "host": "",
            "port": "",
            "path": "",
            "pathPrefix": "",
            "pathPattern": "",
            "actions": ",".join(actions),
            "categories": ",".join(categories),
        })
    return rows


def iter_components(manifest_path: Path):
    """ Yield exported component summaries from *manifest_path*. """
    root = xml_parse(manifest_path).getroot()
    application = root.find("application")
    if application is None:
        return
    for tag in COMPONENT_TAGS:
        for component in application.findall(tag):
            if not is_exported(component):
                continue
            filters = intent_filters(component)
            if not filters:
                yield {
                    "kind": tag,
                    "name": attr(component, "name") or "",
                    "permission": attr(component, "permission") or "",
                    "exported": attr(component, "exported") or "implicit",
                    "scheme": "",
                    "host": "",
                    "port": "",
                    "path": "",
                    "pathPrefix": "",
                    "pathPattern": "",
                    "actions": "",
                    "categories": "",
                }
                continue
            for intent_filter in filters:
                for row in data_rows(intent_filter):
                    row.update({
                        "kind": tag,
                        "name": attr(component, "name") or "",
                        "permission": attr(component, "permission") or "",
                        "exported": attr(component, "exported") or "implicit",
                    })
                    yield row


def parse_args():
    """ Parse command-line arguments. """
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("manifest", help="Path to apktool AndroidManifest.xml")
    return parser.parse_args()


def main() -> int:
    """ Print exported components as tab-separated rows. """
    args = parse_args()
    manifest_path = Path(args.manifest)
    columns = ["kind", "name", "exported", "permission", "scheme", "host", "port", "path", "pathPrefix", "pathPattern", "actions", "categories"]
    print("\t".join(columns))
    for row in iter_components(manifest_path):
        print("\t".join(str(row.get(column, "")) for column in columns))
    return 0


if __name__ == "__main__":
    sys_exit(main())
