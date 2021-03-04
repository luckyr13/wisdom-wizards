const _hasOwnProperty = Object.prototype.hasOwnProperty.call;
const _trim = String.prototype.trim.call;
const _keys = Object.keys;
const _isSafeInteger = Number.isSafeInteger;
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

export function handle(state, action)
{	
	const _msgSender = SmartWeave.transaction.owner;
	const _to = SmartWeave.transaction.target;
	const _tags = SmartWeave.transaction.tags;

	/*
	*	@dev Register user
	*/
	if (action.input.function === "registerUser") {
		// Check if user is already registered
		_modifier_userAlreadyRegistered(state.users, _msgSender);

		// Update state
		// Save new user
		state.users[_msgSender] = { 
			coursesEnrolled: [],
			completedCourses: [],
			coursesEvaluated: []
		};
		return { state };
	}
	/*
	*	@dev Create course
	*/
	if (action.input.function === "createCourse") {
		// Validate if user is not registered
		_modifier_userMustBeRegistered(state.users, _msgSender);

		// Validate inputs that must be strings
		_modifier_validateInputString(action.input.name, 'name', 60);
		_modifier_validateInputString(action.input.description, 'description', 200);
		_modifier_validateInputString(action.input.imgUrl, 'imgUrl', 200);
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.subject, 'subject');

		// Subject must exist
		if (state.subjects[action.input.subject] === undefined ||
				!state.subjects[action.input.subject]) {
			throw new ContractError('Invalid subject');
		}

		// Create course structure
		const res = { 
			name: _trim(action.input.name), 
			description: _trim(action.input.description),
			imgUrl: _trim(action.input.imgUrl),
			subject: action.input.subject, 
			active: false, 
			createdBy: _msgSender,
			users: [],
			passedUsers: [],
			rating: 0,
			evaluators: 0
		};
		// Add new course
		state.courses.push(res);
		return { state };
	}

	/*
	*	@dev Activate/deactivate course
	*/
	if (action.input.function === "updateActiveStatusCourse") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}
		// Only owner (professor) can update the course
		// this helps to know if course should be listed or not in the UI
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);

		// Update state
		state.courses[action.input.courseId].active = !!action.input.active;

		return {state};
	}

	/*
	*	@dev Enroll me in a course
	*/
	if (action.input.function === "enrollMe") {
		// TODO Modifier: User can not be the creator?
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// User must not be already enrolled 
		if (state.courses[action.input.courseId].users.indexOf(_msgSender) >= 0) {
			throw new ContractError('You are already enrolled!');
		}

		// Enroll student
		state.courses[action.input.courseId].users.push(_msgSender);
		// Update student courses info
		state.users[_msgSender].coursesEnrolled.push(action.input.courseId);

		return {state};
	}

	/*
	*	@dev Pass a student
	*/
	if (action.input.function === "passAStudent") {
		// Validate inputs that must be strings
		_modifier_validateInputString(action.input.studentAddress, 'studentAddress', 400);
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// Only owner (professor) can update the course 
		// only professor can pass students
		_modifier_onlyOwnerCanUpdateCourse(state.courses[action.input.courseId], _msgSender);

		// Student must be enrolled
		if (state.courses[action.input.courseId].users.indexOf(action.input.studentAddress) < 0) {
			throw new ContractError('Student is not enrolled!');
		}
		// Student must not be already passed
		if (state.courses[action.input.courseId].passedUsers.indexOf(action.input.studentAddress) >= 0) {
			throw new ContractError('Student already passed!');
		}

		// Update state
		// Add student to the special list
		state.courses[action.input.courseId].passedUsers.push(action.input.studentAddress);
		// Update student's list of passed courses
		state.users[action.input.studentAddress].completedCourses.push(action.input.courseId);

		return {state};
	}

	/*
	*	@dev Rate a course
	*/
	if (action.input.function === "rateACourse") {
		// Validate inputs that must be numbers
		_modifier_validateInputNumber(action.input.courseId, 'courseId');
		_modifier_validateInputNumber(action.input.rating, 'rating');

		// Rating must be between 0 and 10
		if (action.input.rating < 0 || action.input.rating > 10) {
			throw new ContractError(`Rating out of range ${action.input.rating}`);
		}

		// Course must exist
		if (!state.courses[action.input.courseId]) {
			throw new ContractError('Invalid courseId');
		}
		// Course must be active
		if (state.courses[action.input.courseId].active) {
			throw new ContractError('Course is inactive');
		}
		// Student (sender) must be enrolled
		if (state.courses[action.input.courseId].users.indexOf(_msgSender) < 0) {
			throw new ContractError('You are not enrolled in this course!');
		}
		// Student (sender) must be already passed
		if (state.courses[action.input.courseId].passedUsers.indexOf(_msgSender) < 0) {
			throw new ContractError('You must pass the course to unlock this feature!');
		}
		// Course already evaluated
		if (state.users[_msgSender].coursesEvaluated.indexOf(action.input.courseId) >= 0) {
			throw new ContractError('You already evaluated this course!');
		}

		// Update state
		state.users[_msgSender].coursesEvaluated.push(action.input.courseId);
		state.courses[action.input.courseId].evaluators += 1;
		state.courses[action.input.courseId].rating = (
			state.courses[action.input.courseId].rating +
			action.input.rating
		) / state.courses[action.input.courseId].evaluators;
	
		return {state};
	}


	throw new ContractError('Invalid option!');
}

function _modifier_userAlreadyRegistered(_users, _msgSender)
{
	if (_hasOwnProperty(_users, _msgSender) && 
		 _keys(_users[_msgSender]).length > 0) {
		throw new ContractError('User already exists!');
	}
}

function _modifier_userMustBeRegistered(_users, _msgSender)
{
	if (!_hasOwnProperty(_users, _msgSender) || 
		  !_keys(_users[_msgSender]).length) {
		throw new ContractError('You must be registered to create a new course!');
	}
}

function _modifier_validateInputString(_s, _strName, _maxStrLen)
{
	if (typeof _s !== "string" || _s.length > _maxStrLen) {
		throw new ContractError(
			`${_strName} must be a string of less than ${_maxStrLen} characters`
		);
	}
}

function _modifier_validateInputNumber(_n, _nName)
{
	if (isNaN(_n) || !_isSafeInteger(_n)) {
		throw new ContractError(
			`${_nName} must be a number less than ${ MAX_SAFE_INTEGER }`
		);
	}
}

function _modifier_onlyOwnerCanUpdateCourse(_course, _msgSender)
{
	if (_course.createdBy !== _msgSender) {
		throw new ContractError(`You are not the owner of this course!`);
	}
}