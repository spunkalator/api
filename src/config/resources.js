/**
 * Created by Adeyemi on 9/7/2018.
 */

let resources = {
    SUPER_ADMIN: ['SuperAdmin'],
    ADMIN : ['SuperAdmin', 'Admin', 'COMMS', 'OPS'],
    ALL : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', 'Customer', 'Driver', 'Partner'],
    REQUEST_ACCEPT : ['SuperAdmin', 'Admin', 'COMMS','Customer', 'OPS', 'Driver', 'Partner','Recipient'],
    REQUEST_EDIT : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', 'Customer'],
    REQUEST_VIEW : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', 'Customer', 'Driver', 'Partner'],
    TRIP_EDIT : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', ''],
    TRIP_VIEW : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', ''],
    TRIP_COMM : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', ''],

    FLEET_EDIT : ['SuperAdmin', 'Admin', 'COMMS', 'OPS', 'Customer'],
};

module.exports = resources;