// main.js
document.addEventListener('DOMContentLoaded', () => {
    const puzzleNumberSpan = document.getElementById('puzzle-number');
    const toggleAllButton = document.getElementById('toggle-all');
    const verseContainer = document.getElementById('verse-container');
    const gridElement = document.getElementById('grid');
    const gridContainer = document.querySelector('.grid-container');
    const previousPuzzleButton = document.getElementById('previous-puzzle');
    const nextPuzzleButton = document.getElementById('next-puzzle');
    let showAll = false;
    let puzzle = {};

    // Función para navegar a otro puzzle
    function navigateToPuzzle(puzzleNumber) {
        window.location.href = `puzzle_${puzzleNumber}.html`;
    }

    previousPuzzleButton.addEventListener('click', () => {
        const currentPuzzleNumber = parseInt(puzzleNumberSpan.textContent, 10);
        if (currentPuzzleNumber > 1) {
            navigateToPuzzle(currentPuzzleNumber - 1);
        }
    });

    nextPuzzleButton.addEventListener('click', () => {
        const currentPuzzleNumber = parseInt(puzzleNumberSpan.textContent, 10);
        navigateToPuzzle(currentPuzzleNumber + 1);
    });

    toggleAllButton.addEventListener('click', () => {
        showAll = !showAll;
        if (showAll) {
            gridContainer.style.display = 'flex';
            gridContainer.style.animation = 'bounceIn 1s ease forwards';
            gridElement.style.backgroundColor = 'black';
            toggleAllButton.textContent = 'Back';
            highlightAllWords();
            window.scrollBy({ top: 300, behavior: 'smooth' });
        } else {
            gridElement.style.backgroundColor = 'white';
            toggleAllButton.textContent = 'All solutions';
            clearHighlights();
        }
    });

    function highlightWord(word) {
        clearHighlights();
        let wordFound = false;
        for (let rowIndex = 0; rowIndex < puzzle.grid.length; rowIndex++) {
            for (let colIndex = 0; colIndex < puzzle.grid[rowIndex].length; colIndex++) {
                if (checkWord(word, rowIndex, colIndex, 'highlight')) {
                    wordFound = true;
                    return;
                }
            }
        }
        if (!wordFound) {
            alert('Palabra no encontrada');
        }
    }

    function highlightAllWords() {
        const colors = [
            "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF",
            "#33FFF2", "#FF8333", "#3383FF", "#FF3333", "#83FF33",
            "#FF3383", "#FF8333", "#8333FF", "#33FFA1", "#FF33F2",
            "#A1FF33", "#33A1FF", "#FFA133", "#33FF83", "#8333FF",
            "#33FF33", "#FF5733", "#5733FF", "#33FF57", "#F1C40F"
        ];
        clearHighlights();
        puzzle.words_outside.forEach((word, index) => {
            let wordFound = false;
            for (let rowIndex = 0; rowIndex < puzzle.grid.length; rowIndex++) {
                for (let colIndex = 0; colIndex < puzzle.grid[rowIndex].length; colIndex++) {
                    if (checkWord(word, rowIndex, colIndex, 'highlight-all', colors[index % colors.length])) {
                        wordFound = true;
                        break;
                    }
                }
                if (wordFound) break;
            }
        });
    }

    function checkWord(word, row, col, highlightClass, color) {
        const directions = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 }
        ];
        for (let { x, y } of directions) {
            if (isWordAt(word, row, col, x, y, highlightClass, color)) {
                return true;
            }
        }
        return false;
    }

    function isWordAt(word, row, col, x, y, highlightClass, color) {
        const cellsToHighlight = [];
        for (let i = 0; i < word.length; i++) {
            const currentRow = row + i * y;
            const currentCol = col + i * x;
            if (
                currentRow < 0 || currentRow >= puzzle.grid.length ||
                currentCol < 0 || currentCol >= puzzle.grid[0].length ||
                puzzle.grid[currentRow][currentCol] !== word[i]
            ) {
                return false;
            }
            const cell = document.querySelector(`[data-row='${currentRow}'][data-col='${currentCol}']`);
            if (cell) cellsToHighlight.push(cell);
        }
        cellsToHighlight.forEach(cell => {
            cell.classList.add(highlightClass);
            if (color) cell.style.color = color;
        });
        return true;
    }

    function clearHighlights() {
        document.querySelectorAll('.highlight, .highlight-all').forEach(cell => {
            cell.classList.remove('highlight', 'highlight-all');
            cell.style.color = '';
        });
    }

    function showVerse(word) {
        const cleanedWord = word.toLowerCase();
        const verse = puzzle.versos.find(v => v.toLowerCase().includes(`(${cleanedWord})`));
        verseContainer.innerHTML = "";
        if (verse) {
            const cleanedVerse = verse.replace(/\(.*?\)/g, '');
            const p = document.createElement('p');
            p.innerHTML = cleanedVerse;
            verseContainer.appendChild(p);
        } else {
            verseContainer.innerHTML = "Verse not found.";
        }
        verseContainer.classList.add('visible');
    }

    function initPuzzle(puzzleData) {
        puzzle = puzzleData;
        console.log('Puzzle data loaded:', puzzleData); // Log para depuración
        const wordListElement = document.getElementById('word-list');

        // Crear la cuadrícula
        puzzle.grid.forEach((row, rowIndex) => {
            row.forEach((letter, colIndex) => {
                const cell = document.createElement('div');
                cell.textContent = letter;
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;
                gridElement.appendChild(cell);
            });
        });

        // Crear la lista de palabras con colores diferentes para cada fila
        const colors = ['color-row-1', 'color-row-2', 'color-row-3', 'color-row-4'];
        const words = puzzle.words_outside;
        console.log('Words outside:', words); // Log para depuración
        const columns = 3;
        const wordsPerColumn = 6;

        // Crear las columnas de palabras
        for (let col = 0; col < columns; col++) {
            const wordColumn = document.createElement('div');
            wordColumn.classList.add('word-column');
            let limit = wordsPerColumn;
            for (let row = 0; row < limit; row++) {
                const wordIndex = col * wordsPerColumn + row;
                const listItem = document.createElement('li');
                const button = document.createElement('button');
                button.innerHTML = `<span>${wordIndex + 1}. </span><span>${words[wordIndex]}</span>`;
                button.classList.add(colors[wordIndex % colors.length]);
                button.addEventListener('click', () => {
                    const word = words[wordIndex];
                    showAll = false;
                    gridElement.style.backgroundColor = 'white';
                    toggleAllButton.textContent = 'All solutions';
                    gridContainer.style.display = 'flex';
                    gridContainer.style.animation = 'bounceIn 1s ease forwards';
                    highlightWord(word);
                    showVerse(word);
                    verseContainer.classList.add('visible');
                    window.scrollBy({ top: 350, behavior: 'smooth' });
                });
                listItem.appendChild(button);
                wordColumn.appendChild(listItem);
            }
            wordListElement.appendChild(wordColumn);
        }
    }

    // Fetch del archivo JSON y inicialización del puzzle
    const jsonFilePath = document.querySelector('script[data-json-file]').getAttribute('data-json-file');
    console.log('JSON file path:', jsonFilePath); // Log para depuración
    fetch(jsonFilePath)
        .then(response => response.json())
        .then(data => {
            initPuzzle(data);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
});
