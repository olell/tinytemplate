# tinytemplate
Very Small Javascript Template Engine

## Syntax Documentation

### Comments
A comment is sourrounded with `{/*` and `*/}`. Comments is simply removed from the text.    
Example:
```
{/* This is an example comment :) */}
```

### Simple placeholders
A simple placeholder is sourrounded with `{` and `}`. It is simply replaced by the corresponding argument. Paths are possible.
Example:
```
{/* Simple placeholder without path */}
{ test }

{/* Simple placeholder with path */}
{path.subsegment.subsubsegment.etc}
```
Leading and trailing spaces are of course ignored.

## License
MIT License

Copyright (c) 2021 olel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.