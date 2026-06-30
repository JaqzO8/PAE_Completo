const hasAlreadyAnswered = ({ answers, userId, currentQuestionId }) => {
    const normalizedUserId = String(userId);
    const normalizedQuestionId = String(currentQuestionId);
    const answerList = Array.isArray(answers) ? answers : [];

    return answerList.some((answer) => (
        String(answer.userId) === normalizedUserId &&
        String(answer.questionId) === normalizedQuestionId
    ));
};

module.exports = {
    hasAlreadyAnswered,
};
