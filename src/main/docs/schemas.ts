import {
  accountSchema,
  errorSchema,
  loginParamsSchema,
  signUpParamsSchema,
  addSurveyParamsSchema,
  surveyAnswerSchema,
  surveyListSchema,
  surveySchema,
  surveyResultSchema,
  saveSurveyResultParamsSchema,
  surveyResultAnswerSchema
} from './schemas/'

export default {
  error: errorSchema,
  loginParams: loginParamsSchema,
  signUpParams: signUpParamsSchema,
  account: accountSchema,
  addSurveyParams: addSurveyParamsSchema,
  survey: surveySchema,
  surveyAnswer: surveyAnswerSchema,
  surveyList: surveyListSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema,
  saveSurveyResultParams: saveSurveyResultParamsSchema
}
