/*
*	Version 15
*	Thanks God!
*/
export function handle(state, action)
{	
	const caller = action.caller;
	const input = action.input;
	const admins = state.admins;
	const languages = state.languages;
	const subjects = state.subjects;
	const courses = state.courses;
	const arAddressLen = 43;

	/*
	*	@dev Add admin
	*/
	if (input.function === "addAdmin") {
		// Validate new admin address
		const newAdmin = _modifier_validateInputString(
			input.newAdmin,
			'newAdmin',
			arAddressLen
		);

		// Only an admin can do this action
		_modifier_validateAdmin(admins, caller);
		// Check if new admin is already registered
		_modifier_validateIfAdminExists(admins, newAdmin);
		// Validate new langs array
		const approvedLangs = Object.prototype.hasOwnProperty.call(input, 'approvedLangs') &&
			input.approvedLangs ? input.approvedLangs : ["*"];
		if (!Array.isArray(approvedLangs)) {
			throw new ContractError('Approved langs must be an array!');
		}
		for (const al of approvedLangs) {
			if (typeof(al) !== 'string' ||
				  !Object.prototype.hasOwnProperty.call(languages, al)) {
				throw new ContractError(`Invalid langs array! Element: ${al}`);
			}
		}

		// Update state
		// Save new admin
		admins[newAdmin] = {
			"active": true,
			"approved_langs": approvedLangs,
			"approved_by": caller
		};

		return { state };
	}
	/*
	*	@dev Add a new course
	*/
	if (input.function === "addCourse") {
		// Validate inputs that must be strings
		const courseAddress = _modifier_validateInputString(
			input.courseAddress,
			'courseAddress',
			arAddressLen
		);
		const langCode = _modifier_validateInputString(input.langCode, 'langCode', 2);
		const subject = _modifier_validateInputString(input.subject, 'subject', 100);
		const slug = _modifier_validateInputString(input.slug, 'slug', 50);

		// Caller must be an admin
		_modifier_validateAdmin(admins, caller);

		// Validate `subject`
		if (!Object.prototype.hasOwnProperty.call(subjects, subject)) {
			throw new ContractError(`Invalid subject: ${subject}`);
		}
		// Validate lang
		if (!Object.prototype.hasOwnProperty.call(languages, langCode) &&
				!languages[langCode].active) {
			throw new ContractError(`Invalid lang code ${langCode}`);
		}
		// Validate if lang is already on courses dict
		if (!Object.prototype.hasOwnProperty.call(courses, langCode)) {
			courses[langCode] = {};
		} else {
			// Validate `slug`
			if (!Object.prototype.hasOwnProperty.call(courses[langCode], slug)) {
				throw new ContractError(`Slug already exists: ${slug}`);
			}
		}
		// Add course
		courses[langCode][slug] = { 
			address: courseAddress,
			subject, 
			active: true, 
			approvedBy: caller
		};
		
		return { state };
	}

	/*
	*	@dev Activate/deactivate course
	*/
	if (input.function === "updateCourseStatus") {
		const slug = _modifier_validateInputString(input.slug, 'slug', 50);
		const langCode = _modifier_validateInputString(input.langCode, 'langCode', 2);

		// Only admin can update status
		_modifier_validateAdmin(admins, caller);

		// Language must be valid
		if (Object.prototype.hasOwnProperty.call(courses, langCode)) {
			throw new ContractError(`Invalid langCode ${langCode}`);
		}
		// Course must exist
		if (Object.prototype.hasOwnProperty.call(courses[langCode], slug)) {
			throw new ContractError(`Invalid slug ${slug}`);
		}

		// Update state
		courses[langCode][slug].active = !!input.active;

		return {state};
	}

	/*
	*	@dev Activate/deactivate admin status
	*/
	if (input.function === "updateAdminStatus") {
		const targetAdmin = _modifier_validateInputString(
			input.targetAdmin, 'arAddressLen', arAddressLen
		);

		// Only admin can update status
		_modifier_validateAdmin(admins, caller);
		// Validate root admin
		_modifier_validateRootAdmin(admins, caller);
		// Target admin must exist
		_modifier_validateIfAdminDoesntExists(admins, targetAdmin);

		// Update state
		admins[targetAdmin].active = !!input.active;

		return {state};
	}

	/*
	*	@dev Get the list of active courses grouped by subject
	*/
	if (action.input.function === "getActiveCourses") {
		const res = {};
		const langCode = _modifier_validateInputString(input.slug, 'langCode', 2);

		// Language must be valid
		if (Object.prototype.hasOwnProperty.call(courses, langCode)) {
			throw new ContractError(`Invalid langCode ${langCode}`);
		}

		for (let slug in courses[langCode]) {
			const c = courses[slug];

			// Skip inactive courses
			if (!c.active) {
				continue;
			}
			// Save course
			if (!Object.prototype.hasOwnProperty.call(res, c.subject)) {
				res[c.subject] = [];
			}

			res[c.subject].push(c);
		}

		return { result: res }
	}

	throw new ContractError('Invalid option!');
}

/*
*	Validates if the user is an admin
*/
function _modifier_validateAdmin(_admins, _address)
{
	if (!Object.prototype.hasOwnProperty.call(_admins, _address) || 
		 !_admins[_address].active) {
		throw new ContractError(`${address} is not an active admin`);
	}
}

/*
*	Validates if the user is a root admin
*/
function _modifier_validateRootAdmin(_admins, _address)
{
	if (!Object.prototype.hasOwnProperty.call(_admins, _address) || 
		 !_admins[_address].active ||
		 (_admins[_address].approved_langs &&
		   _admins[_address].approved_langs[0] !== '*')) {
		throw new ContractError(`${address} is not a root admin`);
	}
}

function _modifier_validateIfAdminExists(_admins, _caller)
{
	if (Object.prototype.hasOwnProperty.call(_admins, _caller)) {
		throw new ContractError(`${address} is already an admin`);
	}
}

function _modifier_validateIfAdminDoesntExists(_admins, _caller)
{
	if (!Object.prototype.hasOwnProperty.call(_admins, _caller)) {
		throw new ContractError(`${address} is not an admin`);
	}
}


function _modifier_validateInputString(_s, _strName, _maxStrLen)
{
	if (typeof _s !== "string") {
		throw new ContractError(
			`${_strName} must be a string`
		);
	}
	const s = String.prototype.trim(_s);
	if (s.length > _maxStrLen) {
		throw new ContractError(
			`${_strName} must be a string of less than ${_maxStrLen} characters`
		);
	}
	return s;
}

function _modifier_validateInputNumber(_n, _nName)
{
	if (isNaN(_n) || !Number.isSafeInteger(_n)) {
		throw new ContractError(
			`${_nName} must be a number less than ${ Number.MAX_SAFE_INTEGER }`
		);
	}
}
