# Urbanist candidate test #

your task is to create an event manager application
below are the application requirements:

## an event has: ##
*  name
* date
*  guest list

## a guest has: ##
* name
* picture (doesn't have to be stored in db. you can use [http://lorempixel.com/50/50/people](http://lorempixel.com/50/50/people) to get randoms pictures)
* one of the following statuses: **attending**, **not attending**, or **maybe**

## the user can: ##
* add events
* select an event and view its guest list
* add/remove guests in the selected event
* change the status of each guest


## UI ##
* the guest list would be divided to separate sections for each status
* all of the actions in the application should update the UI reactively
* the application **must be responsive**

## NOTES ##
* the project already includes _nemo64:bootstrap_ and _less_ packages for bootstrap 3 styles
* if it's helpful, the project includes a fixture of guests at /fixtures/guests.json

## SUBMISSION ##
* to start the task, please fork this repository
* when you're done, deploy to a Meteor hosted site (*.meteor.com) and share the forked repository
