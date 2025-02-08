let clickCount = 0;

document.getElementById('clickMe').addEventListener('click', () => { clickCount++;
    document.getElementById('counter').textContent = `Count: ${clickCount}`;
    createSparkleEffect();
});

document.getElementById('bgColor').addEventListener('input', (e) => {
    document.body.style.backgroundColor = e.target.value;
});

function createSparkleEffect(){
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${Math.random() * window.innerWidth}px`;
    sparkle.style.top = `${Math.random() * window.innerHeight}px`;
    sparkle.style.fontSize = '24px';
    sparkle.textContent = '✨';

    document.body.appendChild(sparkle);

    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    const content = [
        "Welcome!",
        "Try clicking the button!",
        "Change the background color!",
        "Have fun!"
    ];

    const dynamicDiv = document.getElementById('dynamicContent');
    content.forEach((text, index) => {
        setTimeout(() => {
            dynamicDiv.innerHTML += `<p>${text}</p>`;
        }, index * 1000);
    });

});