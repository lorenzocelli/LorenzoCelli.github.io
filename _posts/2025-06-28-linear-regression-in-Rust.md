---
layout: post
author: lorenzo
title: "Linear Regression in Rust"
---

This summer, I am trying to teach myself Rust, and I thought it would be a good idea to start by implementing a basic linear regression model. In this post we will briefly go over the theory behind linear regression, then we will see how to implement it in Rust.

The source code and sample data for this post is available on GitHub: [lorenzocelli/rust-lin-reg](https://github.com/lorenzocelli/rust-lin-reg/tree/master).

## Simple Linear Regression

Linear regression is a statistical method used to model a relationship between two or more variables. In the simple case, we have one indipendent variable $$X$$ and one dependent variable $$Y$$ which we want to predict. As the name suggests, we are going to assume that there is a linear relationship between them, which can be expressed as:

$$
Y \approx \beta_0 + \beta_1 X 
$$

Now our task is to find the coefficients $$\beta_0$$ and $$\beta_1$$ that yield the best results for our data. In our case, we will minimize the residual sum of squares (RSS), that is the sum of squared differences between the predicted values and the actual values. 

Let us refer to our data points as $$\{(x_i, y_i)\}_{i=1}^n$$ where $$n$$ is the number of data points, $$x_i\sim X$$ and $$y_i\sim Y$$. We will call $$\hat{y}_i$$ our predicted value for $$x_i$$ given our coefficients:

$$
\hat{y}_i = \beta_0 + \beta_1 x_i
$$

No we can express the RSS as:

$$
\mathrm{RSS}=\sum_{i=1}^n (y_i - \hat y_i)^2
$$

Our objective is to minimize this quantity with respect to the coefficients \\( \beta_0 \\) and \\( \beta_1 \\). To do this, we can take the partial derivatives of the RSS with respect to each coefficient, set them to zero, and solve the resulting equations. If we do this, we will find the following formulas:

$$
\begin{align}
\beta_1 = \frac{\sum_{i=1}^n(x_i-\bar{x})(y_i-\bar{y})}{\sum_{i=1}^n(x_i-\bar{x})^2},
\quad
\beta_0 = \bar{y} - \beta_1 \bar{x} \label{coeff-single-var}
\end{align}
$$

Were \\(\bar y\\) is the mean of all \\(y_i\\) and \\(\bar x\\) is the mean of all \\(x_i\\). If you want to read it, <a class="" data-bs-toggle="collapse" href="#collapseExample" role="button">here is a proof</a>.

<div class="collapse" id="collapseExample">
  <div class="py-2 px-3 border rounded-1" style="font-size: 0.95em">

We will homit the subscripts and superscripts from the summations for brevity: all summations go from \(i=1\) to \(n\). First, we derive the RSS with respect to \( \beta_0 \) and set it equal to zero:

$$
\begin{equation}
\frac{\partial \mathrm{RSS}}{\partial \beta_0} = \textstyle\sum -2(y_i - \beta_0 - \beta_1 x_i) 
\implies n \beta_0 + \beta_1 \textstyle\sum x_i = \textstyle\sum y_i \label{der-beta0}
\end{equation}
$$

Now we do the same but derive with respect to \( \beta_1 \):

$$
\begin{align}
\frac{\partial \mathrm{RSS}}{\partial \beta_1} = \textstyle\sum -2x_i(y_i- \beta_0 - \beta_1 x_i) 
\implies \beta_0 \sum x_i + \beta_1 \sum x_i^2 = \sum x_i y_i \label{der-beta1}
\end{align}
$$

Now let us isolate \( \beta_0 \) in equation \( \ref{der-beta0} \):

$$
\begin{align*}
& n \beta_0 + \beta_1 \textstyle{\sum} x_i = \sum y_i \\
& \beta_0 = \textstyle\frac{1}{n} \sum y_i - \frac{\beta_1}{n} \sum x_i = \bar{y}-\beta_1 \bar{x}
\end{align*}
$$

Plugging this into equation \( \ref{der-beta1} \), we get:

$$
\begin{align*}
\left(\bar{y}-\beta_1 \bar{x} \right) \textstyle\sum x_i + \beta_1 \sum x_i^2 &= \textstyle\sum x_i y_i \\
\beta_1 \left(-\bar{x} \textstyle\sum x_i + \sum x_i^2 \right) &= \textstyle\sum x_i y_i - \bar{y} \sum x_i
\end{align*}
$$

Now we can isolate \(\beta_1\):

$$
\begin{align*}
\beta_1 = \frac{\sum x_i y_i - \bar{y} \sum x_i}{-\bar{x} \sum x_i + \sum x_i^2} 
= \frac{\sum x_i(y_i-\bar{y})}{\sum x_i(x_i-\bar{x})}
\end{align*}
$$

Now to bring it to the form which is more commonly seen in textbooks, we have to apply a few tricks. First we observe that \(x_i\) can be expressed as \(\bar{x} + (x_i - \bar{x})\). Hence we can rewrite the formula as:

$$
\beta_1 = \frac{\sum \bar{x}(y_i-\bar{y})+(x_i-\bar{x})(y_i-\bar{y})}
{\sum \bar{x}(x_i-\bar{x})+(x_i-\bar{x})^2}
$$

Now we have to note that \(\sum{(y_i-\bar{y})}=0\), and similarly \(\sum{(x_i-\bar{x})}=0\), which follows from the definition of the mean. Thus, we can simplify the formula to:

$$
\beta_1 = \frac{\sum (x_i-\bar{x})(y_i-\bar{y})}{\sum (x_i-\bar{x})^2}
$$

  </div>
</div>

## Multiple Linear Regression 

What do we do when we have multiple predictor variables \\( X_1,\dots,X_n \\) and we want to use them all to predict a single target variable \\( Y \\)? In this case, we can extend the formula to:

$$
Y \approx \beta_0 + \beta_1 X_1 + \dots + \beta_n X_n
$$

We define \\(\beta=(\beta_0,\dots,\beta_n)\\), and \\(X=(1,X_1,\dots,X_n)\\). By adding a constant \\(1\\) to the \\(X\\) vector we are able to write the operation as a single matrix multiplication: 

$$
Y \approx \beta X
$$

Similarly to the single variable case, we can find the coefficients by minimizing the RSS. In this case, the optimal coefficients are given by:

$$
\begin{equation}
\beta = (X^TX)^{-1}X^TY \label{coeff-multi-var}
\end{equation}
$$

A proof can be found (unsurprisingly) in [The Book of Statistical Proofs](https://statproofbook.github.io/P/mlr-ols2.html).

## Setting Up Rust

Now that we have the theory behind us, we can start setting up the Rust project. If you have not installed Rust yet, I recommend going through the [installation guide](https://doc.rust-lang.org/book/ch01-01-installation.html) on the Rust book. 

We start by creating a new Rust project using Cargo:

```bash
cargo new rust-lin-reg
```

Now we have a skeleton project that we can modify. We need to add the required libraries (or 'Crates' as they are called in Rust) to the `Cargo.toml` file. We will need the `csv` crate to read the data from a csv file, the `ndarray` crate to handle matrices and vectors, and the `ndarray-linalg` crate to solve a linear system (we will see later why we need it).

<pre><code data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/Cargo.toml">
</code></pre>

That's all we need for this project in terms of dependencies!

## Reading CSV Data

For this project we are going to use the `Advertising.csv` dataset from the resources of the book ['An Introduction to Statistical Learning'](https://www.statlearning.com/). You can download it from the official website or from [GitHub](https://github.com/lorenzocelli/rust-lin-reg/blob/master/Advertising.csv).

In our `main.rs` file, we add `use` declarations for the components we need:

<pre><code class="language-rust" data-lines="1-5" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

To read the csv file with Rust, we define a `Record` type which describes the structure of a single data row. Note that this is tailored to the Advertising dataset, so you will need to change it if you are using a different one.

<pre><code class="language-rust" data-lines="7-7" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

Now we can read the csv file and parse it into a vector of `Record` structs.

<pre><code class="language-rust" data-lines="17-25" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

Now we have all our data stored in a vector. However, we still want to convert it to a `ndarray` which gives us access to high-perfomance linear algebra operations. For the single-variable case, we will have two 1d arrays: we will use the 'TV' attribute to predict the 'sales' attribute.

<pre><code class="language-rust" data-lines="27-36" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

## Linear Regression and RSE in Rust

We are ready to perform the actual linear regression and find \\(\beta_0\\) and \\(\beta_1\\). To do so, let's create a function that accepts two arrays of floats and returns the coefficients as a tuple of floats. All we need to do is turning equation \\(\ref{coeff-single-var}\\) into Rust code.

<pre><code class="language-rust" data-lines="66-80" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

That's it. Now we can call this function with our data and print the results.

<pre><code class="language-rust" data-lines="38-40" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

We also want to compute and print a metric to evaluate the performance of our model. A common metric for linear regression is the Residual Standard Error (RSE), which is defined as:

$$
\mathrm{RSE}=\sqrt{\frac{1}{n-2}\mathrm{RSS}}
$$

Let's write a function to compute the RSE given the predictions and the actual values:

<pre><code class="language-rust" data-lines="94-98" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

We can now call this function to print the RSE of our model:

<pre><code class="language-rust" data-lines="43-44" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

That's it for the simple case! We can execute the program with `cargo run` and it should print the following output:

```txt
[7.0325935491276965, 0.047536640433019736]
RSE: 3.2586563686504624
```

## Multiple Linear Regression in Rust

Our Advertising data contains other attributes other than 'TV': 'radio' and 'newspaper'. We can use all attributes to predict 'sales' with multiple linear regression. We need to compute the coefficients using equation \\(\ref{coeff-multi-var}\\). This is easier said than done, as the formula requires computing the inverse of a matrix which is in general an expensive operation. 

However, since \\(X^TX\\) is a square positive definite matrix, we can use [Cholesky decomposition](https://en.wikipedia.org/wiki/Cholesky_decomposition) to compute the inverse more efficiently. The `ndarray-linalg` crate provides a convenient way to do this. It's easier if look at the problem as a linear system in the form \\(Ax=b\\), therefore we rewrite \\(\ref{coeff-multi-var}\\) as:

$$
\underbrace{(X^TX)}_{A}\underbrace{\beta}_{x} = \underbrace{X^TY}_{b}
$$

Now all we need to do to compute the coefficients is to compute the matrices \\(A\\) and \\(b\\) and feed them to the Cholesky solver. Here's how we can do this in Rust:

<pre><code class="language-rust" data-lines="82-92" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

Adding a small constant to the diagonal of \\(A\\) is a common trick used to improve numerical stability when \\(A\\) is near-singular, known as [Tikhonov regularization](https://en.wikipedia.org/wiki/Ridge_regression) or Ridge regression.

Now that we have a method for multiple linear regression, we can put it to the test. The following code extracts the 'TV', 'radio', and 'newspaper' attributes from the dataset, computes the coefficients, and prints them:

<pre><code class="language-rust" data-lines="46-57" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

We can also compute and print the RSE for the multiple linear regression model using the same function we defined earlier:

<pre><code class="language-rust" data-lines="59-61" data-src="https://raw.githubusercontent.com/lorenzocelli/rust-lin-reg/refs/heads/master/src/main.rs">
</code></pre>

If you `cargo run`, you should get the following output:

```txt
[2.938889369449337, 0.045764645455425176, 0.18853001691831814, -0.0010374930424140033]
RSE: 1.6769760888385674
```

The RSE is significantly lower than in the single-variable case, meaning we managed to improve our model by using more features.
