# ZTP - ZPL to PDF Converter

Convert text files containing ZPL code into ready-to-print PDFs with one click

ZTP is a straightforward Windows application that converts ZPL (Zebra Programming Language) files stored in .txt format to PDF documents. It was created specifically for enterprise thermal label printing workflows.

## How It Works

1. Provide .txt files containing raw ZPL code

2. Receive matching PDF files in a specific folder: `shipping_label.txt → shipping_label.pdf`

## Important Notes

- No configuration options: The converter uses fixed label dimensions that match my enterprise requirements

- Customization requires code changes: To modify label size or other parameters, you'll need to edit the source code directly

- Windows-focused: Currently optimized for Windows environments

## Cross-Platform Builds

You can compile the application for macOS or Linux using Tauri's build system. While I haven't tested these versions yet, the core functionality should work across platforms.

> [!TIP]
> To change label dimensions or DPI settings, modify the conversion parameters in the source code before rebuilding the application.
