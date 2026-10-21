# rebuild index.html from src/app.js
s=open('index.html').read()
m='<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>\n<script>\n'
a=s.index(m)+len(m);b=s.index('\n</script>',a)
js=open('src/app.js').read().replace('/*@MODULES@*/',open('src/events.js').read()+'\n'+open('src/retreat.js').read())
open('index.html','w').write(s[:a]+js+s[b:])

