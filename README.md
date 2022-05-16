# react-tag-sphere

![ezgif com-gif-maker](https://user-images.githubusercontent.com/56679289/168609513-424c40ac-59b5-4c2e-a842-074636eec7e5.gif)

Make Animated rotating tag spheres with this library instantly.
All credits to [jjsanmartino03](https://github.com/jjsanmartino03/) for providing [this example](https://github.com/jjsanmartino03/react-tag-sphere)

# Basic Example
```ts
import React from "react";
import { TagSphere } from "react-tag-sphere";

export default function App() {
  return <TagSphere />;
}
```

# No Blur Example
This will disable blur effect on tags as it goes behind. In this example we also see how to change the styles on the font;

```ts
import React from "react";
import { TagSphere } from "react-tag-sphere";

export default function App() {
  return (
    <TagSphere
        style={{
          color: "green",
          fontWeight: "bold",
          fontSize: "1.2rem",
          fontFamily: "monospace",
        }}
        blur={false}
      />
   );
}
```

# Using Images
```ts

const tags = [
  <img
      width={50}
      src={"https://cdn.svgporn.com/logos/react.svg"}
      alt={"Random image"}
    />,
    <img
      width={50}
      src={"https://cdn.svgporn.com/logos/javascript.svg"}
      alt={"Random image"}
    />,
 ]
 import React from "react";
import { TagSphere } from "react-tag-sphere";

export default function App() {
  return (
    <TagSphere
        tags={tags}
      />
   );
}
```



## Properties

| Property | Type  | Default  |
| :---:   | :-----: | :-: |
| tags | (string \| ReactNode)[] | Example given in demo on top |
| radius | number | text.length * 0.25 |
| maxSpeed | number | 7 |
| initialSpeed | number | 32 |
| initialDirection| number | 135 (degrees) |
| keepRollingAfterMouseOut | boolean | true |
| fullWidth | boolean | false | 
| fullHeight | boolean | false |
| userSelect | boolean | false |
| blur | boolean | true |
| blurMultiplier | number | 1 |
| grayscale | boolean | true |