# Models:
### User:
	credentials
	past record in issues helped resolving
	location, avatar etc
	Roles: User, NGO, Admin

### NGO (one person):
	credentials
	assigned & resolved issues
	volunteers under them
	more info where they can showcase their achievements and gather donation

### Admin:
	sees the whole website's performance 
	overall donations 	
	city-wise participation 
	stats: no of issues, ngos etc


### Issues: published by users
	location
	date
	media
	status: unassigned, assigned, resolved
	likes and comments by users

### Jobs: published by NGOs
	location
	positions + slots available
	tasks with WA grp links
	
### Job Enrolled User:	
	tasks assigned by the ngo to this user
	task proof and status updates
	
### Notifications:
	registration
	reminder
	task-assigned
	task proof accepted or rejected


# Website FLOW:
## Issue:
	1. listed by some user
	2. claimed by some ngo. issue status changes to "assigned"
	3. ngo releases list of jobs they need with slots and dates (timing)
	4. users go from issue page to jobs page through a button 
	5. choose the job they want and register for it
	6. ngo gets a notification about new registration 
	7. ngo can assign tasks to each user as per their chosen role
	8. user can submit task proofs and ngo has to approve them or reject them and the user gets notifications of both
    9. when job duration about to end and all tasks of a user is not done then a notification is sent to them 
	10. when job duration ends, ngo can update the job page with images and vides of updated conditions of the issue 
	11. issue status changes to "resolved"




# Features:
	1. notifications to users when an NGO picks up a listed issue by them
	2. past issues shown in the user's profile as to what he has worked on and what issues has he posted. basically his involvement into the commuity
	3. the ngos have their own explore page where they can explore the issues listed by the users
	4. we can also make this location filtered but need to add multiple locations, as there cna be branches of ngos and they can see the listed issues in all these locations
	5. NGOs can send requests to the volunteers those who have worked with them in the past to work on this new issue