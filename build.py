# rebuild index.html from src/app.js
s=open('index.html').read()
m='<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>\n<script>\n'
a=s.index(m)+len(m);b=s.index('\n</script>',a)
open('index.html','w').write(s[:a]+open('src/app.js').read()+s[b:])

open('404.html','w').write(open('index.html').read())
