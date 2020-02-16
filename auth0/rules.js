//
// Use the Auth0 dashboard to add each of these as a rule
//

function (user, context, callback) {
    // user.user_metadata = user.user_metadata || {};
    user.app_metadata = user.app_metadata || {};
    user.app_metadata.roles = user.app_metadata.roles || {};
    context.idToken['https://example.com/roles'] = JSON.stringify(user.app_metadata.roles);
    //
    // Note changes are not persisted
    //
    return callback(null, user, context);
  }
  