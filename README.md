
# Reproducible Steps

1. Clone this repository

```
git clone git@github.com:chengcyber/rush-build-cache-submodule-demo.git
cd rush-build-cache-submodule-demo
```

2. Initialize git submodules

```
git submodule update --init --recursive
```

3. Run rush commands

```
rush update
rush build
```

## Expected Result

Rush.js no more complains about hashing a submodule folder

```
Analyzing repo state... Error calculating the state of the repo. (inner error: Error: git hash-object exited with status 128: fatal: Unable to hash ts-code-demo
). Continuing without diffing files.
```