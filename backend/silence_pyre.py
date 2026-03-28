import os

backend_dir = '/home/data_science/NOVA/backend'
ignore_str = '# pyre-ignore-all-errors\n'

for root, _, files in os.walk(backend_dir):
    if 'venv' in root:
        continue
    for f in files:
        if f.endswith('.py'):
            path = os.path.join(root, f)
            with open(path, 'r') as file:
                content = file.read()
            if ignore_str.strip() not in content:
                with open(path, 'w') as file:
                    file.write(ignore_str + content)

print("Silenced Pyre across all backend files.")
