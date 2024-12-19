fetch('https://jsonplaceholder.typicode.com/users/')
.then(async response => {
    const result = await response.json()

    result.forEach(async element => {
        const div = createUserItem(element)

        div.addEventListener('click', async() => {
            if(document.querySelector('.active')) {
                document.querySelector('.active').classList.remove('active')
            }
            div.classList.add('active')

            const commentsContainer = document.querySelector('.comments_container')
            if(commentsContainer.querySelector('.error').style.display != "none") {
                commentsContainer.querySelector('.error').style.display = "none"
                commentsContainer.querySelector('.comments').style.display = "flex"
            }

            document.querySelector('.comments').querySelectorAll('.item').forEach(item => {
                item.remove()
            })

            element.comments.forEach(el => {
                createCommentItem(el)
            })

            document.querySelector('.comments').scrollTo({ top: 0, behavior: 'smooth' });
        })

        element.comments = []
        await getPostsComments(element)
    })
})

async function getPostsComments(user) {
    const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`)
    const posts = await postsRes.json()

    for (let i = 0; i < posts.length && i <= 2; i++) {
        const el = posts[i];
        const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${el.id}`)
        const result = await response.json()
        result.forEach(comment => {
            user.comments.push(comment)
        })   
    }
}

function createUserItem(user) {
    var div = document.createElement('div')
    div.setAttribute('class', 'item')
    div.innerHTML = `
    <img src="/img/avatar.webp">
    <div class="info">
        <h3>${user.name}</h3>
        <p>${user.username}</p>
        <span>${user.email}</span>
    </div>
    `
    document.querySelector('.users').appendChild(div)
    return div
}

function createCommentItem(comment) {
    var div = document.createElement('div')
    div.setAttribute('class', 'item')
    div.innerHTML = `
    <div class="item">
        <span>${comment.email}</span>
        <h3>${comment.name}</h3>
        <p>${comment.body}</p>
    </div>
    `
    document.querySelector('.comments').appendChild(div)
    return div
}