#!/usr/bin/env bash
set -o nounset
set -o pipefail

usage() {
  cat <<'EOF'
Usage: validate_mermaid.sh [--input-file <path>] [--output <path>] [--format <svg|png|pdf>]

Returns exit code 0 when Mermaid CLI render succeeds.
Returns non-zero and emits raw CLI output on failure.
EOF
}

input_file=""
output_file=""
render_format="svg"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --input-file)
      input_file="${2:-}"
      shift 2
      ;;
    --output)
      output_file="${2:-}"
      shift 2
      ;;
    --format)
      render_format="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ "${render_format}" != "svg" && "${render_format}" != "png" && "${render_format}" != "pdf" ]]; then
  echo "Invalid format '${render_format}'. Use svg, png, or pdf." >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node is not available in PATH. Install Node.js to run Mermaid validation." >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is not available in PATH. Install npm/Node.js to run Mermaid validation." >&2
  exit 1
fi

if [[ -z "${output_file}" ]]; then
  output_file="$(mktemp "/tmp/mermaid-validate-XXXXXX.${render_format}")"
fi

if [[ -n "${input_file}" ]]; then
  if [[ ! -f "${input_file}" ]]; then
    echo "Input file not found: ${input_file}" >&2
    exit 1
  fi
  input_payload="$(cat "${input_file}")"
else
  if [ -t 0 ]; then
    echo "No input provided on stdin. Pass --input-file or pipe Mermaid text." >&2
    exit 1
  fi
  input_payload="$(cat)"
fi

if [[ -z "${input_payload}" ]]; then
  echo "Input Mermaid payload is empty." >&2
  exit 1
fi

cli_output="$(printf '%s' "${input_payload}" | npx -y @mermaid-js/mermaid-cli -i /dev/stdin -o "${output_file}" -e "${render_format}" -b transparent 2>&1)"
status=$?

if [[ ${status} -ne 0 ]]; then
  printf '%s\n' "${cli_output}" >&2
fi

exit ${status}
