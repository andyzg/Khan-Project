# Khan-Project
Project for Khan Academy's interview

### Installation

You'll need npm and bundler for the installation. Run
`make install`
to install all dependencies.

### Building the project

Run `make local` to build the project locally.
It uses browserify to bundle all of the js and compass for the SASS.

### Testing

To run tests, run `make test`.

### Parser Decision

I initially wanted to use Acorn as my parser after doing some research for multiple reasons:
- It's half the size of Esprima
- It's slightly faster than Esprima

Source: http://marijnhaverbeke.nl/blog/acorn.html  
I ran into compatibility problems with my current dev setup(I really wanted to learn Browserify! I also wanted a lightweight package manager): https://github.com/marijnh/acorn/issues/232 . I didn't want to waste time so I chose Esprima instead.

Esprima was a solid alternative. This was because it was more mature, and there were a lot more resources(online demo especially) on their website. It's also heavily tested and is maintained by jQuery. I was also very happy with the simple documentation.


### Current functionality


The demo currently supports the following statements(listed in `src/js/statement.js`):
- For statements
- While statements
- If statements
- Switch statements
- Try statements
- Do while statements
- Expressions
- Variable declarations

For the structure matching constraint, it is fairly loose while matching. That is, if it's looking for
```
[{ 
  type: 'ForStatement', 
  children: [{ type: 'ForStatement' }] 
}]
```
It would pass for 
```
for (;;) {
  if (true) {
    for (;;) {
      console.log('This passes!');
    }
  }
}
```
However, all children must be at the same level. This would fail:
```
[{
  type: 'ForStatement'
}, {
  type: 'ForStatement'
}]
...
for (;;) {}
if (true) {
  for (;;) {}
}
```

### TODO's

Minify the JavaScript code.
