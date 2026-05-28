const pageName = window.location.pathname.split("/").pop();
const appKey = "comments_" + pageName.replace(".html", ""); 

const commentZone = document.getElementById('commentZone');

if (commentZone) {
    commentZone.innerHTML = `
        <div style="margin-top: 40px; border-top: 2px solid var(--border-color); padding-top: 20px;">
            <h3>Avis et Commentaires</h3>
            
            <form id="commentForm" class="comment-form">
                <input type="text" id="commentPseudo" placeholder="Votre pseudo" required class="comment-input-pseudo">
                
                <div class="rating-selection">
                    <span class="rating-title">Votre note :</span>
                    <input type="radio" name="rating" value="5" id="star5" required>
                    <label for="star5">★</label>
                    <input type="radio" name="rating" value="4" id="star4">
                    <label for="star4">★</label>
                    <input type="radio" name="rating" value="3" id="star3">
                    <label for="star3">★</label>
                    <input type="radio" name="rating" value="2" id="star2">
                    <label for="star2">★</label>
                    <input type="radio" name="rating" value="1" id="star1">
                    <label for="star1">★</label>
                </div>

                <textarea id="commentText" rows="3" placeholder="Laissez votre avis..." required class="comment-input-text"></textarea>
                <button type="submit" class="comment-submit-btn">Publier le commentaire</button>
            </form>

            <div id="commentsList" class="comment-list"></div>
        </div>
    `;
}

const commentForm = document.getElementById('commentForm');
const commentPseudo = document.getElementById('commentPseudo');
const commentText = document.getElementById('commentText');
const commentsList = document.getElementById('commentsList');

function getAvatarColor(pseudo) {
    let hash = 0;
    for (let i = 0; i < pseudo.length; i++) {
        hash = pseudo.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#0052cc', '#28a745', '#ea580c', '#8b5cf6', '#ec4899', '#16a34a', '#dc2626', '#0284c7'];
    return colors[Math.abs(hash) % colors.length];
}

function makeStars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function loadComments() {
    if (!commentsList) return; 
    commentsList.innerHTML = ""; 
    
    const storedComments = localStorage.getItem(appKey);
    const comments = storedComments ? JSON.parse(storedComments) : [];

    if (comments.length === 0) {
        commentsList.innerHTML = "<p style='color: #888; font-style: italic;'>Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>";
        return;
    }

    comments.forEach((c, i) => {
        const commentDiv = document.createElement('div');
        commentDiv.className = "single-comment"; 
        
        const firstLetter = c.pseudo ? c.pseudo.charAt(0) : "?";
        const avatarBg = c.pseudo ? getAvatarColor(c.pseudo) : "#ccc";
        const starsHtml = makeStars(c.rating || 5);

        commentDiv.innerHTML = `
            <div class="comment-flex">
                <div class="user-avatar" style="background-color: ${avatarBg};">${firstLetter}</div>
                <div class="comment-details">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <div>
                            <strong style="color: var(--text-color);">${c.pseudo}</strong>
                            <small style="color: #888; margin-left: 10px;">${c.date}</small>
                        </div>
                        <button class="delete-comment-btn" type="button" onclick="deleteComment(${i})">🗑️</button>
                    </div>
                    <div class="stars-display">${starsHtml}</div>
                    <p style="margin: 0; color: var(--text-secondary);">${c.text}</p>
                </div>
            </div>
        `;
        commentsList.appendChild(commentDiv);
    });
}

window.deleteComment = function(index) {
    if (confirm("Voulez-vous vraiment supprimer ce commentaire ?")) {
        const storedComments = localStorage.getItem(appKey);
        if (storedComments) {
            const comments = JSON.parse(storedComments);
            comments.splice(index, 1); 
            localStorage.setItem(appKey, JSON.stringify(comments)); 
            loadComments(); 
        }
    }
}

if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        const pseudo = commentPseudo.value.trim();
        const text = commentText.value.trim();
        const ratingInput = document.querySelector('input[name="rating"]:checked');
        const rating = ratingInput ? parseInt(ratingInput.value) : 5;
        
        const now = new Date();
        const dateStr = now.toLocaleDateString('fr-FR') + " à " + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});

        const storedComments = localStorage.getItem(appKey);
        const comments = storedComments ? JSON.parse(storedComments) : [];

        comments.unshift({ pseudo: pseudo, text: text, date: dateStr, rating: rating });
        localStorage.setItem(appKey, JSON.stringify(comments));

        commentForm.reset();
        loadComments();
    });
}

loadComments();