---
layout: post
author: lorenzo
title: "Quoting Code"
---

While writing the previous article for this blog, I realised that I did not have an easy way to retrieve code snippets (entire files or just some sections) from GitHub. I needed something that would allow me to retrieve the code from an external source without having to copy and paste it into the post.

I looked online, but I could not find much. [prismjs](https://prismjs.com/) does offer this feature, but it also comes with syntax highlighting, whereas I wanted to use [highlight.js](https://highlightjs.org/) for that.

To solve this problem, I created a very small JavaScript library that can fetch code snippets from a specified URL and insert them into the post. It's called `codequote.js`, and you can find it on [GitHub](https://github.com/lorenzocelli/codequote.js).

Here's a sample usage:

<pre><code class="language-html" data-lines="8-10" data-src="https://raw.githubusercontent.com/lorenzocelli/codequote.js/refs/heads/main/README.md">
</code></pre>

This example is itself 'quoted' from the README of the library’s GitHub repository. It is also possible to specify a range of lines:

<pre><code class="language-html" data-lines="16-18" data-src="https://raw.githubusercontent.com/lorenzocelli/codequote.js/refs/heads/main/README.md">
</code></pre>

This approach has two advantages: it allows you to keep the code in a single place (which is [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)), and makes it possible to update the code in the post without having to edit the post itself. When the source code changes, the post will automatically update.

Unfortunately, there are limitations. When quoting specific sections, updating the source can result in the line numbers changing, which can break existing quotes. For this reason, when a file is likely to change, it is better to quote it in its entirety. Usually the source code for blog posts is stable, so this is not a big issue. On the other hand, in this post I have quoted code from a README file, which is a bad idea as the README is very likely to change (but I'll take the risk).
