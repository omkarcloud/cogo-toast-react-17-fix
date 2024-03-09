## cogo-toast-react-17-fix

A compatibility fix for the popular 'cogo-toast' package that resolves dependency conflicts with React 17+.

**Problem**

The original cogo-toast library has a strict peer dependency on React 16. This causes installation and compatibility issues when used with React 17 or newer versions. 

**Solution**

The 'cogo-toast-react-17-fix' package provides the necessary modifications to ensure that cogo-toast functions correctly within React 17+ environments. 

**Installation**

```bash
npm install cogo-toast-react-17-fix
```

**Usage** 

Import and use the provided `cogoToast` component exactly as you would in the original 'cogo-toast' package. There are no additional changes required.

```javascript
import cogoToast from 'cogo-toast-react-17-fix';

cogoToast.success('This is a success message!');
```

**Example**

```javascript
import React from 'react';
import cogoToast from 'cogo-toast-react-17-fix';

const App = () => {
  const handleButtonClick = () => {
    cogoToast.error('This is an error message!');
  }

  return (
    <button onClick={handleButtonClick}>Show Error Toast</button>
  );
}

export default App;
```

**Important Notes**

* Please refer to the original 'cogo-toast' documentation for detailed usage and customization of toast messages: [https://github.com/Cogoport/cogo-toast](https://github.com/Cogoport/cogo-toast) 
 
---


## Love It? [Star It ⭐!](https://github.com/omkarcloud/cogo-toast-react-17-fix)

Become one of our amazing stargazers by giving us a star ⭐ on GitHub!

It's just one click, but it means the world to me.

[![Stargazers for @omkarcloud/cogo-toast-react-17-fix](https://bytecrank.com/nastyox/reporoster/php/stargazersSVG.php?user=omkarcloud&repo=cogo-toast-react-17-fix)](https://github.com/omkarcloud/cogo-toast-react-17-fix/stargazers)
