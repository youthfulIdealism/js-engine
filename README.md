# smoulder

WARNING: THIS MODULE IS IN DEVELOPMENT AND IS NOWHERE NEAR STABLE. USE AT YOUR OWN RISK.

Binding between Firestore and Vue. Supports child queries.

Example:

```
// fetch a user, all the user's recipies, and all the ratings on each recipie.
// Binding is live--if a recipie changes, Smoulder detects the change through
// the firestore client library and updates Vue as a result.
let vue = new Vue(/* vue config */);
let smoulder = new Smoulder(vue);
smoulder.query(firestore, `user/${user_id}`).populate(
    smoulder.query(firestore, 'recipie').where('user_id', '==', '{id}').populate(
        smoulder.query(firestore, 'ratings').where('recipie_id', '==', '{id}')
    )
).get();

```

I'm accepting bug reports and PRs, but I'm extremely new at the whole "open-source" thing. Expect some learning on my part.