# cmnext_2022
---------------------------------
https://dev.to/hajhosein/nextjs-mui-v5-typescript-tutorial-and-starter-3pab
npx create-next-app@latest cmnextstock-2022 --typescript
yarn add @emotion/cache @emotion/react @emotion/server @emotion/styled
yarn add @mui/material


# vscode extension 
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension vscode-icons-team.vscode-icons
code --install-extension naumovs.color-highlight
code --install-extension esbenp.prettier-vscode
code --install-extension humao.rest-client
code --install-extension riazxrazor.html-to-jsx
code --install-extension christian-kohler.path-intellisense
code --install-extension alexcvzz.vscode-sqlite

# cmnext_2022
---------------------------------
https://dev.to/hajhosein/nextjs-mui-v5-typescript-tutorial-and-starter-3pab
npx create-next-app@latest cmnextstock-2022 --typescript
yarn add @emotion/cache @emotion/react @emotion/server @emotion/styled
yarn add @mui/material
yarn add @mui/icons-material
yarn add formik formik-material-ui chart.js react-chartjs-2 react-moment react-number-format
yarn add @reduxjs/toolkit react-redux axios cookie @react-hook/debounce @mui/x-data-grid moment react-iframe
yarn add @types/cookie --dev



-----------
<Link href="/about" passHref>
  <Button variant="contained" color="secondary">About</Button>
</Link>


<Link href="/about" passHref>
 <ListItem button component="a" onClick={onClick}>
  <ListItemText>About</ListItemText>
 </ListItem>
</Link>

# next.config.js
  images: {
    domains: ["localhost"],
  },


# Deployment (look at package.json)
----------------------
yarn dev 
yarn build
yarn start

"dev": "next dev -p 3005"
or 
yarn dev -p 3005
yarn start -p 3005