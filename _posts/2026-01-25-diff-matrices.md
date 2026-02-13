---
layout: post
author: lorenzo
title: "Matrix Differentiation for Deep Learning"
---

While working on a project for a class on deep learning, I was looking for a way to differentiate functions of a matrix and I stumbled upon the book ['Matrix Differential Calculus with Applications in Statistics and Econometrics'](https://onlinelibrary.wiley.com/doi/book/10.1002/9781119541219) by Jan R. Magnus and Heinz Neudecker. I found the book to be very well written and I wanted to share some of the key concepts I learned from it.

In this post I will avoid excessive formalism, hoping to get the main ideas of the framework across. For a more rigorous treatment, I highly recommend reading the book itself.

## Numerator Layout

The usual way to write down the derivative of a scalar function $f(x):\mathbb R\to\mathbb R$ is by using [Leibniz notation](https://en.wikipedia.org/wiki/Notation_for_differentiation):

$$
\frac{\partial f}{\partial x}
$$

When dealing with scalar functions $f(\mathbf x):\mathbb R^n\to\mathbb R$, the question arises of how to 'store' the derivatives with respect to each component of the input vector. If we decide to use a column vector $\mathbb{R}^{n \times 1}$, we obtain the gradient:

$$
\nabla f(\mathbf x) = \begin{bmatrix}
\frac{\partial f}{\partial x_1} \\
\frac{\partial f}{\partial x_2} \\
\vdots \\
\frac{\partial f}{\partial x_n}
\end{bmatrix}
$$

However, this is not our only option. We can also store the partial derivatives of $f$ in a row vector $\mathbb{R}^{1 \times n}$ as follows:

$$
\frac{\partial f}{\partial \mathbf x} = \begin{bmatrix}
\frac{\partial f}{\partial x_1} & \frac{\partial f}{\partial x_2} & \cdots & \frac{\partial f}{\partial x_n}
\end{bmatrix}
$$

What happens for a function $f$ that takes a vector and returns a vector?
In this case, we stack the row vectors for each output component vertically, obtaining the [Jacobian matrix](https://en.wikipedia.org/wiki/Jacobian_matrix_and_determinant):

$$
\frac{\partial f}{\partial \mathbf x} = \begin{bmatrix}
\frac{\partial f_1}{\partial x_1} & \frac{\partial f_1}{\partial x_2} & \cdots & \frac{\partial f_1}{\partial x_n} \\
\frac{\partial f_2}{\partial x_1} & \frac{\partial f_2}{\partial x_2} & \cdots & \frac{\partial f_2}{\partial x_n} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial f_m}{\partial x_1} & \frac{\partial f_m}{\partial x_2} & \cdots & \frac{\partial f_m}{\partial x_n}
\end{bmatrix}
$$

Derivatives in this format are said to be in *numerator layout*, as opposed to *denominator layout*, where we use gradients and stack them as columns. Usually, the numerator layout is preferred, as it leads to simpler expressions when differentiating matrix functions.

So far we have considered functions that take vectors as input and output. What happens when we have matrices instead? There are multiple ways to go about it, including [tensors](https://en.wikipedia.org/wiki/Tensor), which are multidimensional arrays that generalize matrices to higher dimensions. 

For now let us focus on a simpler case: a function $f$ that takes an $m\times n$ matrix as input and returns a scalar. In this case, since we have $1$ output and $m\times n$ inputs, we can still arrange the partial derivatives in a matrix. We will use the same notation as before, but we should note that this is not a Jacobian but rather what we could call a 'matrix-shaped gradient':

$$
\begin{equation}
\label{eq:matrix_gradient_scalar}
\frac{\partial f}{\partial X} = \begin{bmatrix}
\frac{\partial f}{\partial X_{11}} & \frac{\partial f}{
\partial X_{12}} & \cdots & \frac{\partial f}{\partial X_{1n}} \\
\frac{\partial f}{\partial X_{21}} & \frac{\partial f}{\partial X_{22}} & \cdots & \frac{\partial f}{\partial X_{2n}} \\
\vdots & \vdots & \ddots & \vdots \\
\frac{\partial f}{\partial X_{m1}} & \frac{\partial f}{\partial X_{m2}} & \cdots & \frac{\partial f}{\partial X_{mn}}
\end{bmatrix}
\end{equation}
$$

Later, we will see how to obtain Jacobians and matrix-shaped gradients using the approach presented in the book, but first we need to introduce some notation.

## Vectorization and the Kronecker Product

Let's introduce two important operators that are used extensively when differentiating matrices with the framework presented in the book. The first one is the vectorization operator, denoted as $\mathrm{vec}(\cdot)$. This operator takes a matrix and stacks its columns into a single column vector. For example:

$$
X=\begin{bmatrix}
a & b \\
c & d 
\end{bmatrix} \implies \mathrm{vec}(X) = \begin{bmatrix}
a \\
c \\
b \\
d
\end{bmatrix}
$$

The second operator is the [Kronecker product](https://en.wikipedia.org/wiki/Kronecker_product), denoted by the symbol $\otimes$. Given two matrices $A \in \mathbb{R}^{m \times n}$ and $B \in \mathbb{R}^{p \times q}$, their Kronecker product is a $\mathbb{R}^{mp \times nq}$ matrix defined as:

$$
A \otimes B ={\begin{bmatrix}a_{11} {B} &\cdots &a_{1n} {B} \\\vdots &\ddots &\vdots \\a_{m1} {B} &\cdots &a_{mn} {B} \end{bmatrix}}
$$

These two operators are linked by the following identity, which holds for any matrices $A$, $B$, and $C$ of compatible dimensions:

$$
\begin{equation}
\label{eq:kronecker_vec}
\mathrm{vec}(ABC) = (C^T \otimes A) \mathrm{vec}(B)
\end{equation}
$$

## Differentials

In the book, the authors advocate the use of *differentials* to compute derivatives of matrix functions. A differential is the multidimensional generalization of the $dx$ term in scalar calculus. For a function $f$ the differential is written $\textsf{d}f$. Let's not define it formally here, but rather see how it works in practice.

Usually, our goal is to find the derivative (Jacobian matrix) of a function. Using the framework of differentials, we first compute the differential of the function, and then relate it to the Jacobian matrix. 

For example, let us consider a function $f(\mathbf x):\mathbb R^n\to\mathbb R$:

$$
f(\mathbf x) = \mathbf a^T \mathbf x
$$

We take the differential of both sides:

$$
\textsf{d}f = \textsf{d}(\mathbf a^T \mathbf x)
$$

Here we can use the product rule for differentials: $\textsf{d}(uv) = u \textsf{d}v + v \textsf{d}u$. Since $\mathbf a$ is constant, its differential is zero, so we have:

$$
\textsf{d}f = \mathbf a^T \textsf{d}\mathbf x
$$

We managed to isolate the differential of the input $\textsf{d}\mathbf x$. Now we can relate this expression to the Jacobian matrix of $f$. In the book, the Jacobian is expressed as $\textsf{D} f$, and it is the matrix $A$ such that $\textsf{d}f = A \textsf{d}\mathbf x$. In this case:

$$
\textsf{D} f = \mathbf a^T
$$

Note that this is consistent with our previous definition of Jacobian in numerator layout: $a^T$ is a row vector containing the partial derivatives of $f$ with respect to each component of $\mathbf x$.

## Matrix Functions

Let's now move on to functions that take matrices as input and return matrices as output, which is the most common case in deep learning. For a function $F(X): \mathbb{R}^{m\times n} \to \mathbb{R}^{p \times q}$, let us define an equivalent vector-to-vector function $f:\mathbb{R}^{mn} \to \mathbb{R}^{pq}$ such that:

$$
f(\mathrm{vec}(X)) = \mathrm{vec}(F(X))
$$

The Jacobian of $F$ is defined as the Jacobian of $f$:

$$
\textsf{D} F(X) = \textsf{D} f(\mathrm{vec}(X))
$$

$\textsf{D} F(X)$ is a $pq \times mn$ matrix that does not contain in its structure information about the matrix dimensions of the input and output. As an example, let us consider the function:

$$
F(X) = A X B
$$

Taking the differential of both sides, we have:

$$
\textsf{d}F = \textsf{d}(A X B) = A \textsf{d}X B
$$

Now we apply the vectorization operator on both sides. Whenever we have a vectorized matrix multiplication, we can use the property of the Kronecker product $\eqref{eq:kronecker_vec}$ to isolate the differential:

$$
\textsf{d}\mathrm{vec}(F) = \mathrm{vec}(A \textsf{d}X B) = (B^T \otimes A) \mathrm{vec}(\textsf{d}X)
$$

Now that we have isolated $\mathrm{vec}(\textsf{d}X)$, we can identify the Jacobian matrix, which is the matrix pre-multiplying the differential of the input (equivalent to what we did for vector functions):

$$
\begin{equation}
\label{eq:jacobian_matrix_multiplication}
\textsf{D} F(X) = B^T \otimes A
\end{equation}
$$

## The Chain Rule

One of the most important properties of derivatives, not only in deep learning, is the chain rule. When using this framework, the chain rule is simply the matrix multiplication of Jacobians. For example, let us consider two functions $F(X): \mathbb{R}^{m\times n} \to \mathbb{R}^{p \times q}$ and $G(Y): \mathbb{R}^{p\times q} \to \mathbb{R}^{r \times s}$, and let us define the composition $H(X) = G(F(X))$. The chain rule states that:

$$
\begin{equation}
\label{eq:chain_rule}
\textsf{D} H(X) = \textsf{D} G(F(X)) \ \textsf{D} F(X)
\end{equation}
$$

If we wanted the differential of $H$ instead, we can use the following identity that follows from the definition of Jacobian:

$$
\begin{equation}
\label{eq:chain_rule_differential}
\mathrm{vec}\ \textsf{d} H = \textsf{D} H\ \mathrm{vec}(\textsf{d}X) 
= \textsf{D} G \ \textsf{D} F \ \mathrm{vec}(\textsf{d}X)
= \textsf{D} G \ \mathrm{vec}(\textsf{d} F)
\end{equation}
$$

## Matrix-shaped Gradients

Let us finally consider a special case of matrix functions that is very common in deep learning: scalar functions of matrices. In most cases we formulate the training process as the minimization of a loss function that takes as input different matrices (weights, data samples, labels) and returns a scalar value. We are interested in computing the derivative of the loss with respect to its arguments for backpropagation.

For a loss function $\mathcal L(W): \mathbb{R}^{m \times n} \to \mathbb{R}$ that depends on a matrix of weights, the Jacobian $\textsf{D} \mathcal L$ is a $1 \times mn$ row vector. However, it is often more convenient to reshape this vector back into a matrix of the same dimensions as $W$. To perform gradient descent, for example, we update $W$ by subtracting the derivative of the loss with respect to $W$, therefore having the derivative in matrix form is more convenient. This is exactly what we defined earlier as a matrix-shaped gradient $\eqref{eq:matrix_gradient_scalar}$.

Magnus and Neudecker in their book provide two identities that relate the matrix-shaped gradient to the differential and the Jacobian of a scalar function of a matrix. They can be found in the 'first identification table' in the book:

$$
\begin{align}
\label{eq:matrix_gradient_first_identification}
\textsf{d} \phi = \mathrm{tr} (A^T \textsf{d}X) \\
\label{eq:matrix_gradient_second_identification}
\textsf{D} \phi = (\mathrm{vec} A)^T
\end{align}
$$

Where $\phi(X): \mathbb{R}^{m \times n} \to \mathbb{R}$ is a scalar function of a matrix, and $A\in\mathbb{R}^{m \times n}$ is its matrix-shaped gradient $\partial \phi/\partial X$. These two identities allow us to go back and forth between the differential or Jacobian and the matrix-shaped gradient as defined in \eqref{eq:matrix_gradient_scalar}.

Let's consider as an example a composition between a vector to scalar function $\mathcal L:\mathbb{R}^m \to \mathbb{R}$ and a linear layer $W\mathbf x+\mathbf b$, where $W\in\mathbb{R}^{m \times n}$ and $\mathbf x \in \mathbb{R}^n$. Let us call the composition $\phi: \mathbb{R}^{m \times n} \to \mathbb{R}$:

$$
\phi(W) = \mathcal L(W\mathbf x+\mathbf b)
$$

Now we can compute the differential of $\phi$ with respect to $W$, using the chain rule as in equation $\eqref{eq:chain_rule_differential}$. The differential of $\phi$ is a scalar, and the differential of the linear layer is a vector, therefore we can omit the vectorization operators.

$$
\textsf{d}\phi(W) 
= \textsf{D}\mathcal L(W\mathbf x+\mathbf b) \textsf{d}(W\mathbf x+\mathbf b)
= \textsf{D}\mathcal L(W\mathbf x+\mathbf b) (\textsf{d}W)\mathbf x
$$

Here we apply the trace 'trick' from the first identity above. Since $\textsf{d}\phi$ is a scalar, $\textsf{d}\phi(W) = \operatorname{tr}(\textsf{d}\phi(W))$. Applying the trace on both sides we have:

$$
\textsf{d}\phi(W) = \operatorname{tr}(\textsf{D}\mathcal L(W\mathbf x+\mathbf b) (\textsf{d}W)\mathbf x)
$$

Now our objective is to bring the differential of the weights $\textsf{d}W$ to the rightmost position inside the trace, so that we can compare with $\eqref{eq:matrix_gradient_first_identification}$. Due to the cyclic property of the trace, we can just move $\mathbf x$ to the left:

$$
\textsf{d}\phi(W) = \operatorname{tr}(\mathbf x\ \textsf{D}\mathcal L(W\mathbf x+\mathbf b) (\textsf{d}W))
$$

We can now identify the matrix-shaped gradient of $\phi$. Notice that in $\eqref{eq:matrix_gradient_first_identification}$ the matrix $A$ is transposed, so we need to transpose the whole expression:

$$
\frac{\partial \phi}{\partial W} = \textsf{D}\mathcal L(W\mathbf x+\mathbf b)^T \mathbf x^T
= \nabla \mathcal L(W\mathbf x+\mathbf b)\ \mathbf x^T
$$

Note that $(\textsf{D}\mathcal L)^T=\nabla \mathcal L$. The result is therefore the outer product between the gradient of the loss and the input vector $\mathbf x$.

We could stop here, but let us see how to obtain the same result using the Jacobian instead of the differential.
We use the chain rule as in $\eqref{eq:chain_rule}$ and the identity for the Jacobian of a matrix multiplication found earlier $\eqref{eq:jacobian_matrix_multiplication}$:

$$
\textsf{D}\phi=\textsf{D}\mathcal L(W\mathbf x+\mathbf b)\ \textsf{D}(W\mathbf x+\mathbf b)=\textsf{D}\mathcal L(W\mathbf x+\mathbf b) (\mathbf x^T \otimes I)
$$

If we transpose both sides, we can use the property $\eqref{eq:kronecker_vec}$ (in the 'reverse' direction compared to before) to replace the Kronecker product with a vectorized matrix product:

$$
(\textsf{D}\phi)^T=(\mathbf x \otimes I)\left(\textsf{D}\mathcal L(W\mathbf x+\mathbf b)\right)^T=\mathrm{vec}(\left(\textsf{D}\mathcal L(W\mathbf x+\mathbf b)\right)^T \mathbf x^T)
$$

Now we can compare with $\eqref{eq:matrix_gradient_second_identification}$ and identify the matrix-shaped gradient, which matches the result we obtained using the differential.

<!--
## Differentiating Convolutions

We will now try to differentiate a convolutional layer applying a kernel $K\in \mathbb{R}^{m\times n}$ to an input image $X\in \mathbb{R}^{p\times q}$. Let's first define the convolution operation as follows:

$$
Y_{i,j} = (K * X)_{i,j} = \sum_{u=1}^{m} \sum_{v=1}^{n} K_{u,v} X_{i + u - 1, j + v - 1}
$$

This is actually a cross-correlation but it's now standard in deep learning to refer to it as convolution. The first step before we can differentiate is to transform this expression into some kind of matrix operation.

$$

$$
-->
