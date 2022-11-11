
# Team Spinner

![spinnerDemo2](https://user-images.githubusercontent.com/10081163/201414336-40d75941-9bd9-4c40-8a26-f8575181a347.gif)


This is a spinner that you can use for selecting a team member. It retrieves the team members to display from the url hash so you can use it for any set of people without having to update any code. Feel free to try it out at https://amberzlee.com/spinner

## Usage

The team members to display in the spinner are part of the url hash. When adding or removing team members with the `Add team member` or the `x` button the url hash will **automatically** be updated so you can bookmark the page to save the current team members.

For example if you navigate to https://amberzlee.com/spinner and want to create a spinner with 3 people `Person1`, `Person2`, and `Person3` then you can remove all the default team members and add the names and then the url will have a hash of the team members stored. You can then bookmark the tab.

![spinnerDemo7](https://user-images.githubusercontent.com/10081163/201418230-9e7930dc-2ce3-4fd5-bbf9-19903f830a8f.gif)

## Multiple teams

Multiple teams is supported via the `Select team` dropdown however you will need to generate the hash. 

To do so deine the team members as an object with the key being the team name and the value being a list of the team member names. Then run the base64 encoding on the stringified object to get the hash and add it to the url.

Ex.
```
function utf8_to_b64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

function parseTeamMembers(teamMembers) {
  return utf8_to_b64(JSON.stringify(teamMembers));
}

const team = {
  'Team #1': ['Amy', 'Bob', 'Cal', 'Martin', 'Heidi', 'Krystal'],
  'Team #2': ['Derek', 'Grace', 'Jim'],
  'Team #3': ['Curly', 'Moe', 'Dan', 'Elle'],
  'Team #4': ['Charlie', 'John']
}
console.log(parseTeamMembers(team));
```

This generates a hash of `eyJUZWFtICMxIjpbIkFteSIsIkJvYiIsIkNhbCIsIk1hcnRpbiIsIkhlaWRpIiwiS3J5c3RhbCJdLCJUZWFtICMyIjpbIkRlcmVrIiwiR3JhY2UiLCJKaW0iXSwiVGVhbSAjMyI6WyJDdXJseSIsIk1vZSIsIkRhbiIsIkVsbGUiXSwiVGVhbSAjNCI6WyJDaGFybGllIiwiSm9obiJdfQ==` so if I navigate to https://www.amberzlee.com/spinner/#eyJUZWFtICMxIjpbIkFteSIsIkJvYiIsIkNhbCIsIk1hcnRpbiIsIkhlaWRpIiwiS3J5c3RhbCJdLCJUZWFtICMyIjpbIkRlcmVrIiwiR3JhY2UiLCJKaW0iXSwiVGVhbSAjMyI6WyJDdXJseSIsIk1vZSIsIkRhbiIsIkVsbGUiXSwiVGVhbSAjNCI6WyJDaGFybGllIiwiSm9obiJdfQ== I can view the spinner with the teams I defined.

![spinnerDemo4](https://user-images.githubusercontent.com/10081163/201417310-75d1ef74-f0e9-4074-8707-13afe6ea57bf.gif)
