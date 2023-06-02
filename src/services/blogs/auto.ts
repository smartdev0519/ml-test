import createBlogsByAutoGpt from '../openai/createBlogs';
import check from 'check-types';
import typeCheck from 'type-check'

export const autoCreateBlogs = (data, socket) => {
    try {
        const { goals, temperature } = data;

        const resultTemperature = checkTypeOfTemp(temperature);
        const resultGoals = checkTypeOfGoals(goals);

        if(resultGoals.error) {
          socket.emit('response-auto-create-blogs', {status: 400, message: resultGoals.message});
        } else {
          if(resultTemperature.error) {
            socket.emit('response-auto-create-blogs', {status: 400, message: resultTemperature.message});
          } else {
            if(!resultGoals.error && !resultTemperature.error) {
              createBlogsByAutoGpt(data, socket);
            }
          }
        }
      
    } catch (e) {
      console.log(e);
      socket.emit('response-auto-create-blogs', {status: 500, error: e});
    }
}

const checkTypeOfGoals = (goals) => {
  let result = { error: false, message: '' };
  const typeChecker = typeCheck.typeCheck;

  if(!typeChecker('[String]', goals)) {
    result.error = true;
    result.message = 'Goal type should be string array.'
  } else {
    if(!check.array.of.nonEmptyString(goals)) {
      result.error = true;
      result.message = 'There are empty values in goal array.'
    }
  }

  return result;
}

const checkTypeOfTemp = (temp) => {
  let result = { error: false, message: '' }

  if(typeof temp !== 'number') {
    result.error = true;
    result.message = 'The type of temperature should be number.'
  } 

  return result;
}
  