/* 
    Function That :
    - Takes Link as argument 
    - Make synchronous new XMLHttpRequest()  
    - Return myRequest.responseText as a json Object
*/
const getData = (apiLink) => {
    const myRequest = new XMLHttpRequest();
    myRequest.open("GET", apiLink, false); // `false` makes the request { synchronous }
    myRequest.send(null);
    if (myRequest.readyState === 4 && myRequest.status === 200) {
        return myRequest.responseText;
    }
};

/* Get quiz_details using getData() */
let quiz_details = JSON.parse(getData('../data/quiz_details.json'));

/* Get questions_data using getData() */
let quiz_type = sessionStorage.getItem('quiz_type');

if (quiz_type === null) {
    sessionStorage.setItem('quiz_type', 'Programming');
    quiz_type = sessionStorage.getItem('quiz_type')
}

let questions_data = JSON.parse(getData(`../data/${quiz_type}_questions_data.json`));
/* --------------------------------------------------------------------------------------- */

const Intro_page = () => {
    // intro_page div
    const intro_page = document.createElement('div');
    intro_page.setAttribute('class', 'intro_page');

    // container div
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    // content div
    const content = document.createElement('div');
    content.setAttribute('class', 'content');

    // Appending ( intro_page_message ) in content
    function intro_page_message() {
        // intro_page_message div
        const intro_page_message = document.createElement('div');
        intro_page_message.setAttribute('class', 'intro_page_message');

        // quiz_type div
        const quiz_type = document.createElement('div');
        quiz_type.setAttribute('class', 'quiz_type');
        quiz_type.setAttribute('id', 'quiz_type');

        quiz_type.innerHTML += "<label for='types'>Choose Quiz Type:</label>";
        quiz_type.innerHTML += `<select name ='types'>
        <option value="Programming">Programming</option>
        <option value="HTML">HTML</option>
        <option value="CSS">CSS</option>
        <option value="JavaScript">JavaScript</option>
        </select>`;
        intro_page_message.appendChild(quiz_type);


        // message_description p
        const message_description = document.createElement('p');
        message_description.setAttribute('class', 'message_description');
        message_description.innerHTML = `This is Quiz consists of <span>${questions_data.length}</span> questions <br>`
            + `Time is <span>${quiz_details.time}</span>`;
        intro_page_message.appendChild(message_description);

        // start_btn button
        const start_btn = document.createElement('button');
        start_btn.setAttribute('class', 'btn start_btn');
        start_btn.innerHTML = `Start Quiz`;
        intro_page_message.appendChild(start_btn);

        // start_btn click event
        start_btn.addEventListener('click', () => {
            Quiz_page();
        });

        content.appendChild(intro_page_message);
    } intro_page_message();

    // show_intro_page_in_root
    function show_intro_page_in_root() {
        container.appendChild(content);
        intro_page.appendChild(container);
        document.body.querySelector('#root').innerHTML = '';
        document.body.querySelector('#root').appendChild(intro_page);
        sessionStorage.setItem('current_page', 'Intro_page');
    } show_intro_page_in_root();

    // quiz_type change event
    document.querySelector('#quiz_type select').addEventListener('change', () => {
        sessionStorage.setItem('quiz_type', document.querySelector('#quiz_type select').value);

        let quiz_type = sessionStorage.getItem('quiz_type');
        questions_data = JSON.parse(getData(`../data/${quiz_type}_questions_data.json`));

        document.querySelector('.intro_page_message .message_description').innerHTML =
            `This is Quiz consists of <span>${questions_data.length}</span> questions <br>`
            + `Time is <span>${quiz_details.time}</span>`;
    });

    // window on reload
    window.addEventListener('load', () => {
        document.querySelector('#quiz_type select').value = sessionStorage.getItem('quiz_type');
    })
}

/* --------------------------------------------------------------------------------------- */

const Quiz_page = () => {
    // Setting Variables
    let question_index = 0;
    let stop_time = false;

    // quiz_page div
    const quiz_page = document.createElement('div');
    quiz_page.setAttribute('class', 'quiz_page');

    // container div
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    // content div
    const content = document.createElement('div');
    content.setAttribute('class', 'content');

    // Appending ( session_details ) in content
    function session_details() {
        // session_details div
        const session_details = document.createElement('div');
        session_details.setAttribute('class', 'session_details');

        // session_number div
        const session_number = document.createElement('div');
        session_number.setAttribute('class', 'session_number');
        session_number.innerHTML = `Session 1`;
        session_details.appendChild(session_number);

        // timer div
        const timer = document.createElement('div');
        timer.setAttribute('class', 'timer');
        // timer i
        const timer_icon = document.createElement('i');
        timer_icon.setAttribute('class', 'fa-solid fa-hourglass-end');
        timer.appendChild(timer_icon);
        // timer span
        const timer_span = document.createElement('span');
        timer_span.setAttribute('class', 'count_down');
        timer_span.setAttribute('id', 'count_down');
        timer.appendChild(timer_span);
        session_details.appendChild(timer);

        content.appendChild(session_details);
    } session_details();

    // Appending ( question ) in content
    function question() {
        // question div
        const question = document.createElement('div');
        question.setAttribute('class', 'question');

        // Appending ( question_number ) in question
        function question_number() {
            // question_number div
            const question_number = document.createElement('div');
            question_number.setAttribute('class', 'question_number');
            question_number.setAttribute('id', 'question_number');

            // text span
            const text = document.createElement('span');
            text.textContent = 'Question'
            question_number.appendChild(text);

            // number span
            const number = document.createElement('span');
            number.setAttribute('id', 'number');
            question_number.appendChild(number);

            question.appendChild(question_number);
        } question_number();

        // Appending ( question_title ) in question
        function question_title() {
            // question_title div
            const question_title = document.createElement('div');
            question_title.setAttribute('class', 'question_title');
            question_title.setAttribute('id', 'question_title');
            question.appendChild(question_title);
        } question_title();

        // Appending ( question_answers ) in question
        function question_answers() {
            // question_answers div
            const question_answers = document.createElement('div');
            question_answers.setAttribute('class', 'question_answers');
            question_answers.setAttribute('id', 'question_answers');
            question_answers.innerHTML = '';
            question.appendChild(question_answers);
        } question_answers();

        content.appendChild(question);
    } question();

    // Appending ( question_controls ) in content
    function question_controls() {
        // question_controls div
        const question_controls = document.createElement('div');
        question_controls.setAttribute('class', 'question_controls');

        // prev_next div
        const prev_next = document.createElement('div');
        prev_next.setAttribute('class', 'prev_next');

        // prev div btn
        const prev = document.createElement('div');
        prev.setAttribute('class', 'previous_btn btn');
        prev.setAttribute('id', 'previous_btn');
        prev.innerHTML = `previous`;
        prev_next.appendChild(prev);

        // next div btn
        const next = document.createElement('div');
        next.setAttribute('class', 'next_btn btn');
        next.setAttribute('id', 'next_btn');
        next.innerHTML = `next`;
        prev_next.appendChild(next);

        question_controls.appendChild(prev_next);

        // finish btn
        const finish = document.createElement('div');
        finish.setAttribute('class', 'finish_btn btn');
        finish.setAttribute('id', 'finish_btn');
        finish.innerHTML = `finish`;
        question_controls.appendChild(finish);

        content.appendChild(question_controls);
    } question_controls()

    // show_quiz_page_in_root
    function show_quiz_page_in_root() {
        container.appendChild(content);
        quiz_page.appendChild(container);
        document.body.querySelector('#root').innerHTML = '';
        document.body.querySelector('#root').appendChild(quiz_page);
        sessionStorage.setItem('current_page', 'Quiz_page');
    } show_quiz_page_in_root();

    // controlling_timer_count_down
    function controlling_timer_count_down() {
        // timer_span span
        const count_down = document.querySelector('#count_down');

        let minutes;
        let seconds;

        if (
            sessionStorage.getItem('current_minutes') === null &&
            sessionStorage.getItem('current_seconds') === null
        ) {
            const time = quiz_details.time;
            minutes = Number(time.substring(0, 2));
            seconds = Number(time.substring(3, 5));

            sessionStorage.setItem('current_minutes', minutes);
            sessionStorage.setItem('current_seconds', seconds);
        } else {
            minutes = Number(sessionStorage.getItem('current_minutes'));
            seconds = Number(sessionStorage.getItem('current_seconds'));
        }

        count_down.innerHTML = (minutes < 10 ? '0' : '') + minutes + ":"
            + (seconds < 10 ? '0' : '') + seconds;

        // Setting timer count down interval
        const timerInterval = setInterval(() => {
            if (seconds == 0 && minutes == 0 || stop_time === true) {
                clearInterval(timerInterval);
                document.querySelector('#finish_btn').click();
            } else {
                minutes = Number(sessionStorage.getItem('current_minutes'));
                seconds = Number(sessionStorage.getItem('current_seconds'));

                seconds > 0 ? seconds-- : seconds = 59;
                seconds == 59 ? minutes-- : '';

                sessionStorage.setItem('current_minutes', minutes);
                sessionStorage.setItem('current_seconds', seconds);
            }

            count_down.innerHTML = (minutes < 10 ? '0' : '') + minutes + ":"
                + (seconds < 10 ? '0' : '') + seconds;
        }, 1000);
    } controlling_timer_count_down();

    // controlling_current_question
    function controlling_current_question() {
        // controlling question_number
        document.querySelector('#question_number #number').textContent = question_index + 1;

        // controlling question_title
        document.querySelector('#question_title').textContent = questions_data[question_index].title;

        // controlling question_answers
        function question_answers() {
            const question_answers = document.querySelector('#question_answers');
            question_answers.innerHTML = '';

            questions_data[question_index].answers.map((item, index) => {
                // answer label
                const label = document.createElement("label");
                label.setAttribute('class', 'answer');
                label.setAttribute('for', `answer_${index + 1}`);

                // label click event
                label.addEventListener('click', () => {
                    const user_answer = document.querySelector('#question_answers input[name="answer"]:checked');
                    if (user_answer != null) {
                        sessionStorage.setItem(`question_${question_index + 1}_user_answer`, user_answer.value);
                    }
                })

                // input
                const input = document.createElement("input");
                input.setAttribute('id', `answer_${index + 1}`);
                input.setAttribute('type', 'radio');
                input.setAttribute('name', 'answer');
                input.setAttribute('value', item);
                label.appendChild(input);

                // span
                const span = document.createElement("span");
                span.textContent = item;
                label.appendChild(span);

                question_answers.appendChild(label);
            });
        } question_answers();
    } controlling_current_question();

    // controlling_question_controls
    function controlling_question_controls() {
        // controlling previous_btn
        document.querySelector('#previous_btn').addEventListener('click', () => {
            if (question_index > 0) {
                question_index--;
                controlling_current_question();
                check_sessionStorage_user_answer();
                sessionStorage.setItem('current_question_index', question_index);
            }
        });

        // controlling next_btn
        document.querySelector('#next_btn').addEventListener('click', () => {
            if (question_index < questions_data.length - 1) {
                question_index++;
                controlling_current_question();
                check_sessionStorage_user_answer();
                sessionStorage.setItem('current_question_index', question_index);
            }
        });

        // controlling finish_btn
        document.querySelector('#finish_btn').addEventListener('click', () => {
            stop_time = true;
            Result_page();
        });
    } controlling_question_controls();

    // check_sessionStorage_user_answer
    function check_sessionStorage_user_answer() {
        const user_answer = sessionStorage.getItem(`question_${question_index + 1}_user_answer`);
        if (user_answer != null) {
            document.querySelector(`#question_answers input[value="${user_answer}"]`).click();
        }
    }

    // window reload event
    window.addEventListener('load', () => {
        question_index = Number(sessionStorage.getItem('current_question_index'));
        controlling_current_question();
        check_sessionStorage_user_answer();
    });
}

/* --------------------------------------------------------------------------------------- */

const Result_page = () => {
    // result_Page div
    const result_Page = document.createElement('div');
    result_Page.setAttribute('class', 'result_Page');

    // container div
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    // content div
    const content = document.createElement('div');
    content.setAttribute('class', 'content');

    // Appending ( result_message ) in content
    function result_message() {
        // result_message div
        const result_message = document.createElement('div');
        result_message.setAttribute('class', 'result_message');

        // message_description p
        const message_description = document.createElement('p');
        message_description.setAttribute('class', 'message_description');
        message_description.innerHTML = `number of quiz questions = <span>${questions_data.length}</span><br>`
            + `Correct questions you answered = <span>${get_results()}</span><br>`
            + `your degree = <span>${(get_results() / questions_data.length * 100).toFixed(2)}%</span>`;
        result_message.appendChild(message_description);

        // review_Quiz button
        const review_Quiz = document.createElement('button');
        review_Quiz.setAttribute('class', 'btn review_Quiz');
        review_Quiz.innerHTML = `Review Quiz`;
        result_message.appendChild(review_Quiz);

        // review_Quiz click event
        review_Quiz.addEventListener('click', () => {
            Review_page();
        });

        // finish btn
        const finish = document.createElement('div');
        finish.setAttribute('class', 'btn finish_btn');
        finish.innerHTML = `finish`;
        result_message.appendChild(finish);

        // finish_btn click event
        finish.addEventListener('click', () => {
            sessionStorage.clear();
            Intro_page();
            window.location.reload();
        });

        content.appendChild(result_message);
    } result_message();

    // show_result_page_in_root
    function show_result_page_in_root() {
        container.appendChild(content);
        result_Page.appendChild(container);
        document.body.querySelector('#root').innerHTML = '';
        document.body.querySelector('#root').appendChild(result_Page);
        sessionStorage.setItem('current_page', 'Result_page');
    } show_result_page_in_root();

    // get_results correct user_answers
    function get_results() {
        let correct_questions = 0;
        questions_data.map((question, index) => {
            const user_answer = sessionStorage.getItem(`question_${index + 1}_user_answer`);
            if (user_answer === question.right_answer) {
                correct_questions++;
            }
        });
        return correct_questions;
    }
}

/* --------------------------------------------------------------------------------------- */

const Review_page = () => {
    let question_index = 0;

    // review_page div
    const review_page = document.createElement('div');
    review_page.setAttribute('class', 'review_page');

    // container div
    const container = document.createElement('div');
    container.setAttribute('class', 'container');

    // content div
    const content = document.createElement('div');
    content.setAttribute('class', 'content');

    // Appending ( session_details ) in content
    function session_details() {
        // session_details div
        const session_details = document.createElement('div');
        session_details.setAttribute('class', 'session_details');

        // session_number div
        const session_number = document.createElement('div');
        session_number.setAttribute('class', 'session_number');
        session_number.innerHTML = `Session 1`;
        session_details.appendChild(session_number);

        content.appendChild(session_details);
    } session_details();

    // Appending ( question ) in content
    function question() {
        // question div
        const question = document.createElement('div');
        question.setAttribute('class', 'question');

        // Appending ( question_number ) in question
        function question_number() {
            // question_number div
            const question_number = document.createElement('div');
            question_number.setAttribute('class', 'question_number');
            question_number.setAttribute('id', 'question_number');

            // text span
            const text = document.createElement('span');
            text.textContent = 'Question'
            question_number.appendChild(text);

            // number span
            const number = document.createElement('span');
            number.setAttribute('id', 'number');
            question_number.appendChild(number);

            question.appendChild(question_number);
        } question_number();

        // Appending ( question_title ) in question
        function question_title() {
            // question_title div
            const question_title = document.createElement('div');
            question_title.setAttribute('class', 'question_title');
            question_title.setAttribute('id', 'question_title');
            question.appendChild(question_title);
        } question_title();

        // Appending ( question_answers ) in question
        function question_answers() {
            // question_answers div
            const question_answers = document.createElement('div');
            question_answers.setAttribute('class', 'question_answers');
            question_answers.setAttribute('id', 'question_answers');
            question_answers.innerHTML = '';
            question.appendChild(question_answers);
        } question_answers();

        content.appendChild(question);
    } question();

    // Appending ( question_controls ) in content
    function question_controls() {
        // question_controls div
        const question_controls = document.createElement('div');
        question_controls.setAttribute('class', 'question_controls');

        // prev_next div
        const prev_next = document.createElement('div');
        prev_next.setAttribute('class', 'prev_next');

        // prev div btn
        const prev = document.createElement('div');
        prev.setAttribute('class', 'previous_btn btn');
        prev.setAttribute('id', 'previous_btn');
        prev.innerHTML = `previous`;
        prev_next.appendChild(prev);

        // next div btn
        const next = document.createElement('div');
        next.setAttribute('class', 'next_btn btn');
        next.setAttribute('id', 'next_btn');
        next.innerHTML = `next`;
        prev_next.appendChild(next);

        question_controls.appendChild(prev_next);

        // finish btn
        const finish = document.createElement('div');
        finish.setAttribute('class', 'finish_btn btn');
        finish.setAttribute('id', 'finish_btn');
        finish.innerHTML = `finish`;
        question_controls.appendChild(finish);

        content.appendChild(question_controls);
    } question_controls()

    // show_review_page_in_root
    function show_review_page_in_root() {
        container.appendChild(content);
        review_page.appendChild(container);
        document.body.querySelector('#root').innerHTML = '';
        document.body.querySelector('#root').appendChild(review_page);
        sessionStorage.setItem('current_page', 'Review_page');
    } show_review_page_in_root();

    // controlling_current_question
    function controlling_current_question() {
        // controlling question_number
        document.querySelector('#question_number #number').textContent = question_index + 1;

        // controlling question_title
        document.querySelector('#question_title').textContent = questions_data[question_index].title;

        // controlling question_answers
        function question_answers() {
            const question_answers = document.querySelector('#question_answers');
            question_answers.innerHTML = '';

            questions_data[question_index].answers.map((item, index) => {
                // answer label
                const label = document.createElement("label");
                label.setAttribute('class', 'answer');
                label.setAttribute('for', `answer_${index + 1}`);

                // input
                const input = document.createElement("input");
                input.setAttribute('id', `answer_${index + 1}`);
                input.setAttribute('type', 'radio');
                input.setAttribute('name', 'answer');
                input.setAttribute('value', item);
                label.appendChild(input);

                // span
                const span = document.createElement("span");
                span.textContent = item;
                label.appendChild(span);

                question_answers.appendChild(label);
            });
        } question_answers();
    } controlling_current_question();

    // correcting_answers
    function correcting_answers() {
        const user_answer = sessionStorage.getItem(`question_${question_index + 1}_user_answer`);
        document.querySelectorAll("#question_answers label input").forEach((input) => {
            if (user_answer === input.value && user_answer === questions_data[question_index].right_answer) {
                input.click();
                input.parentElement.style.background = 'var(--correct_answer)';
            } else if (user_answer === input.value && user_answer !== questions_data[question_index].right_answer) {
                input.click();
                input.parentElement.style.background = 'var(--wrong_answer)';
                document.querySelector(`#question_answers label input[value="${questions_data[question_index].right_answer}"]`)
                    .parentElement.style.background = 'var(--correct_answer)';
            } else if (user_answer === null) {
                document.querySelector(`#question_answers label input[value="${questions_data[question_index].right_answer}"]`)
                    .parentElement.style.background = 'var(--correct_answer)';
            }
        });
    } correcting_answers();

    // controlling_question_controls
    function controlling_question_controls() {
        // controlling previous_btn
        document.querySelector('#previous_btn').addEventListener('click', () => {
            if (question_index > 0) {
                question_index--;
                controlling_current_question();
                correcting_answers();
                sessionStorage.setItem('current_question_index', question_index);
            }
        });

        // controlling next_btn
        document.querySelector('#next_btn').addEventListener('click', () => {
            if (question_index < questions_data.length - 1) {
                question_index++;
                controlling_current_question();
                correcting_answers();
                sessionStorage.setItem('current_question_index', question_index);
            }
        });

        // controlling finish_btn
        document.querySelector('#finish_btn').addEventListener('click', () => {
            sessionStorage.clear();
            Intro_page();
            window.location.reload();
        });
    } controlling_question_controls();

    // window reload event
    window.addEventListener('load', () => {
        question_index = Number(sessionStorage.getItem('current_question_index'));
        controlling_current_question();
        correcting_answers();
    });
}

/* --------------------------------------------------------------------------------------- */

function current_page() {
    switch (sessionStorage.getItem('current_page')) {
        case null:
            Intro_page();
            break;
        case 'Intro_page':
            Intro_page();
            break;
        case 'Quiz_page':
            Quiz_page();
            break;
        case 'Result_page':
            Result_page();
            break;
        case 'Review_page':
            Review_page();
            break;
    }
}
current_page();