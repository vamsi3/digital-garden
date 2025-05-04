#!/usr/bin/env python3
import os
import re
import argparse

def derive_title_from_filename(filename):
    """Derives a title from a filename."""
    name_without_extension = os.path.splitext(filename)[0]
    # Replace hyphens and underscores with spaces
    title = name_without_extension.replace('-', ' ').replace('_', ' ')
    # Title case (capitalize first letter of each word)
    return title.title()

def has_frontmatter(content):
    """Checks if the content string starts with YAML frontmatter."""
    # Regex to detect frontmatter (--- at the start, followed by anything, then ---)
    # It also handles cases with optional whitespace around the ---
    # and ensures there's content (even if just whitespace) between the delimiters.
    return bool(re.match(r"^\s*---\s*\n(.|\n)*?\n\s*---\s*\n", content))

def add_frontmatter_to_file(filepath):
    """
    Adds frontmatter with a title derived from the filename if no frontmatter exists.
    Returns a status string: "updated", "skipped", or "error".
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        if has_frontmatter(content):
            print(f"Skipped: Frontmatter already exists in '{filepath}'")
            return "skipped"

        filename = os.path.basename(filepath)
        title = derive_title_from_filename(filename)

        # Ensure title doesn't contain problematic characters for YAML (e.g., quotes)
        # Simple approach: wrap in double quotes if it contains a colon or single quote
        if ':' in title or "'" in title:
            title = f'"{title}"'

        frontmatter = f"---\ntitle: {title}\n---\n\n"
        new_content = frontmatter + content

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: Added frontmatter to '{filepath}' with title: {title}")
        return "updated"
    except Exception as e:
        print(f"Error processing file '{filepath}': {e}")
        return "error"

def process_directory(dir_path):
    """
    Processes all .md and .mdx files in the given directory.
    Handles tilde expansion for user home directory.
    """
    # Expand tilde to user's home directory
    expanded_dir_path = os.path.expanduser(dir_path)

    if not os.path.isdir(expanded_dir_path):
        print(f"Error: Directory '{expanded_dir_path}' not found (resolved from '{dir_path}').")
        return

    print(f"Processing directory: '{expanded_dir_path}'\n")

    updated_files_count = 0
    skipped_files_count = 0
    error_files_count = 0
    processed_files_count = 0

    for root, _, files in os.walk(expanded_dir_path):
        for file in files:
            if file.endswith((".md", ".mdx")):
                processed_files_count += 1
                filepath = os.path.join(root, file)
                status = add_frontmatter_to_file(filepath)
                if status == "updated":
                    updated_files_count +=1
                elif status == "skipped":
                    skipped_files_count += 1
                elif status == "error":
                    error_files_count += 1

    print("\n--- Summary ---")
    print(f"Total files scanned (.md, .mdx): {processed_files_count}")
    print(f"Files updated: {updated_files_count}")
    print(f"Files skipped (frontmatter already existed): {skipped_files_count}")
    if error_files_count > 0:
        print(f"Files with errors: {error_files_count}")
    print("Processing complete.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Scans a subdirectory for Markdown/MDX files and adds YAML frontmatter with a title derived from the filename if frontmatter doesn't already exist."
    )
    parser.add_argument(
        "directory",
        metavar="TARGET_DIRECTORY",
        type=str,
        help="The path to the subdirectory to process. Tilde (~) for home directory is supported."
    )

    args = parser.parse_args()
    process_directory(args.directory)