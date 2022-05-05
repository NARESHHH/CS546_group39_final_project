db = db.getSiblingDB('CS_546_G39');

// Creating Indexes
db.users.createIndex( {'location': "2dsphere" } );
db.users.createIndex( { 'interestsString': "text" } )
