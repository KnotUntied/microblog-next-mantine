# Grinberg's Microblog API, Next.js, Mantine

Initially tried emulating his tutorial with Next.js and a [client generated from OpenAPI](https://github.com/ferdikoomen/openapi-typescript-codegen) but had trouble with loading the access token to the OpenAPI client before everything else, so I resorted to using his API client instead.

Token is stored in localStorage for now, [as documented under Grinberg's tutorial](https://blog.miguelgrinberg.com/post/the-react-mega-tutorial-chapter-8-authentication). Security concerns are also discussed there.

A non-breaking Next.js error pops up while being redirected after login, but I am not sure how to address it.