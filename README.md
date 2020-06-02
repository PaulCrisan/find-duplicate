<b>Find files with same content recursively inside a parent directory</b>

Min node version needed is ^6

</br>

usage:

clone it

<br>

To access it globally from everywhere:

```
cd cloned-directory

npm install -g ./

```

or

```
cd cloned-directory

npm link

```

</br>

use afterwards as:

```
fdup <absolute/path/to/directory/where-duplicate-files-are> [filetype-to-search-for]
```

<br/>

or if you want to search for multiple files (no space between multiple file types):

```
fdup <absolute/path/to/directory/where-duplicate-files-are> [filetype1,filetype2,etc]
```

</br>
Example:

```
fdup ~/some-directory  css,scss

```
