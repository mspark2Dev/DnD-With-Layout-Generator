let option = {
    column: 0,
    row: 0,
    columnGap: 0,
    rowGap: 0,
    columnSizes: [],
    rowSizes: [],
};

let selectedObject = {
    start: '',
    end: '',
};

const randomString = () => {
    return Math.random().toString(36).substring(2, 11);
};

const randomHexColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgba(${r}, ${g}, ${b}, 0.2)`;
};

const resetGrid = () => {
    init();
};

const saveGrid = () => {
    if (confirm('레이아웃을 저장하시겠습니까?')) {
        if (document.querySelector('.grid-box').childNodes.length > 0) {
            const target = document.querySelector('.grid-copy');
            const removed = target.querySelectorAll('h1');
            removed.forEach((remove) => {
                remove.remove();
            });

            target.childNodes.forEach((child) => {
                child.classList.add('drop');
                child.style.backgroundColor = '';
            });

            target.id = 'grid';
            target.className = 'drop-zone';

            console.log(target.outerHTML);
        } else {
            alert('선택된 영역이 없습니다.');
            return;
        }
    }
};

const removeMergedGrid = (e) => {
    if (confirm('해당 영역을 삭제하시겠습니까?')) {
        const targetData = e.target.textContent;
        const target = document.querySelector(`.grid-copy div[data-target="${targetData}"]`);
        target.remove();
        e.target.remove();
    }
};

const changeColumnSize = () => {
    const columnSizes = [];

    document.querySelectorAll('.column-size input').forEach((column) => {
        columnSizes.push(column.value);
    });

    option['columnSizes'] = columnSizes;
    initializeGrid();
};

const changeRowSize = () => {
    const rowSizes = [];

    document.querySelectorAll('.row-size input').forEach((row) => {
        rowSizes.push(row.value);
    });

    option['rowSizes'] = rowSizes;
    initializeGrid();
};

const applyGridStyle = (target) => {
    const columnSizeDiv = document.querySelector('.column-size');
    const rowSizeDiv = document.querySelector('.row-size');

    let columns = [];
    let rows = [];

    for (let i = 0; i < option.column; i++) {
        if (option.columnSizes.length !== option.column) {
            columns.push('1fr');
        } else {
            columns.push(option.columnSizes[i]);
        }
    }

    for (let i = 0; i < option.row; i++) {
        if (option.rowSizes.length !== option.row) {
            rows.push('1fr');
        } else {
            rows.push(option.rowSizes[i]);
        }
    }

    target.style.gridTemplateColumns = `${columns.join(' ')}`;
    columnSizeDiv.style.gridTemplateColumns = `${columns.join(' ')}`;
    columnSizeDiv.style.gridTemplateRows = `1fr`;
    target.style.gridTemplateRows = `${rows.join(' ')}`;
    rowSizeDiv.style.gridTemplateColumns = `1fr`;
    rowSizeDiv.style.gridTemplateRows = `${rows.join(' ')}`;
    target.style.gridGap = `${option.rowGap}px ${option.columnGap}px`;
};

const createCopyElement = (target, startC, startR, endC, endR) => {
    const gridBox = document.querySelector('#grid-box');

    const div = document.createElement('div');
    const str = randomString();
    const color = randomHexColor();
    div.className = 'grid';
    div.style.gridArea = `${startR} / ${startC} / ${endR} / ${endC}`;
    div.style.backgroundColor = color;
    div.setAttribute('data-target', str);
    const h1 = document.createElement('h1');
    h1.className = 'fs-1 fw-bold';
    h1.textContent = str;
    div.appendChild(h1);
    target.appendChild(div);

    const div2 = document.createElement('div');
    div2.className = 'p-2 mt-1 text-center item';
    div2.style.backgroundColor = color;
    div2.style.borderRadius = '10px';
    div2.style.cursor = 'pointer';
    div2.textContent = str;
    div2.addEventListener('click', removeMergedGrid);
    gridBox.appendChild(div2);
};

const createGridTemplate = (target, column, row) => {
    const columnSizeDiv = document.querySelector('.column-size');
    const rowSizeDiv = document.querySelector('.row-size');

    target.innerHTML = '';
    columnSizeDiv.innerHTML = '';
    rowSizeDiv.innerHTML = '';

    for (let i = 0; i < column; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control form-control-sm';
        input.addEventListener('focusout', changeColumnSize);
        if (option.columnSizes.length !== column) {
            input.value = '1fr';
        } else {
            input.value = option.columnSizes[i];
        }
        columnSizeDiv.appendChild(input);
    }

    for (let i = 0; i < row; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control form-control-sm';
        input.addEventListener('focusout', changeRowSize);
        if (option.rowSizes.length !== row) {
            input.value = '1fr';
        } else {
            input.value = option.rowSizes[i];
        }
        rowSizeDiv.appendChild(input);
    }

    for (let i = 0; i < column * row; i++) {
        const div = document.createElement('div');
        div.className = 'grid';
        target.appendChild(div);
    }
};

const initializeGrid = () => {
    const gridElement = document.querySelector('#grid');

    const column = parseInt(document.querySelector('input[name="column"]').value);
    const row = parseInt(document.querySelector('input[name="row"]').value);
    const columnGap = parseInt(document.querySelector('input[name="column-gap"]').value);
    const rowGap = parseInt(document.querySelector('input[name="row-gap"]').value);

    createGridTemplate(gridElement, column, row);

    const columnSizes = [];
    const rowSizes = [];

    document.querySelectorAll('.column-size input').forEach((column) => {
        columnSizes.push(column.value);
    });

    document.querySelectorAll('.row-size input').forEach((row) => {
        rowSizes.push(row.value);
    });

    option = { column, row, columnGap, rowGap, columnSizes, rowSizes };

    applyGridStyle(gridElement);

    if (document.querySelector('.grid-copy')) {
        document.querySelector('.grid-copy').remove();
    }

    const copyElement = gridElement.cloneNode(false);
    copyElement.id = 'grid-copy';
    copyElement.style.zIndex = -1;
    copyElement.classList.add('grid-copy');
    document.querySelector('.generator').appendChild(copyElement);
};

const gridSizeHandler = (e) => {
    const target = e.target;
    option[target.name] = parseInt(target.value);

    initializeGrid();
};

const inputHandler = () => {
    const settings = document.querySelectorAll('.setting input');

    settings.forEach((setting) => {
        setting.addEventListener('change', gridSizeHandler);
    });
};

const calculateElementIndex = (target) => {
    let idx = 0;
    while ((target = target.previousSibling) != null) {
        idx++;
    }
    return idx;
};

const calculateMerge = () => {
    const start = selectedObject['start'];
    const startIndex = calculateElementIndex(start) + 1;
    const end = selectedObject['end'];
    const endIndex = calculateElementIndex(end) + 1;

    const columnSize = option['column'];

    const startColumn = startIndex % columnSize === 0 ? columnSize : startIndex % columnSize;
    const startRow = Math.ceil(startIndex / columnSize);

    const endColumn = endIndex % columnSize === 0 ? columnSize + 1 : (endIndex % columnSize) + 1;
    const endRow = Math.ceil(endIndex / columnSize) + 1;

    const copyElement = document.querySelector('.grid-copy');

    if (startColumn > endColumn - 1 || startRow > endRow - 1) {
        selectedObject = { start: '', end: '' };
        return false;
    } else {
        createCopyElement(copyElement, startColumn, startRow, endColumn, endRow);
    }

    selectedObject = { start: '', end: '' };
};

const mouseUpHandler = (e) => {
    if (e.target.classList.contains('grid')) {
        e.preventDefault();
        selectedObject['end'] = e.target;
        calculateMerge();
    }
};

const mouseDownHandler = (e) => {
    if (e.target.classList.contains('grid')) {
        e.preventDefault();
        selectedObject['start'] = e.target;
    }
};

const mouseHandler = () => {
    window.addEventListener('mousedown', mouseDownHandler);

    window.addEventListener('mouseup', mouseUpHandler);
};

const init = () => {
    mouseHandler();
    inputHandler();
    initializeGrid();
    document.querySelector('#grid-box').innerHTML = '';
};

init();
