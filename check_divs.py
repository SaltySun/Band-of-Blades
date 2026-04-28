with open('app/pages/wiki.vue', 'r', encoding='utf-8') as f:
    lines = f.readlines()

depth = 0
for i, line in enumerate(lines):
    opens = line.count('<div')
    closes = line.count('</div>')
    if opens or closes:
        old_depth = depth
        depth += opens - closes
        indent = "  " * max(0, old_depth)
        print(f'{i+1:4d}  {indent}{line.rstrip()[:100]}')
        if depth < 0:
            print(f'  *** NEGATIVE at line {i+1}')

print(f'\nFinal depth: {depth}')
