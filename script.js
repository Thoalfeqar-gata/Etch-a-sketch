let gridSize = 12;
let gridWidth = 480;
let gridHeight = 480;
let drawingColor = "rgb(255, 0, 255)";
let randomColorMode = false;
let slowMode = false;

let gridContainer = document.querySelector("#grid-container");
gridContainer.style.width = gridWidth + "px";
gridContainer.style.height = gridHeight + "px";

function setup(size)
{
    gridSize = size;

    for(let i = 0; i < gridSize; i++)
    {
        let row = document.createElement("div");
        row.className = "grid-row";
        row.style.width = gridWidth + "px";
        row.style.height = gridHeight / gridSize + "px";
    
        for(let j = 0; j < gridSize; j++)
        {
            let pixel = document.createElement("div");
            pixel.className = "grid-pixel";
            pixel.style.width = gridWidth / gridSize + "px";
            pixel.style.heigh = gridHeight / gridSize + "px";
            pixel.addEventListener("mouseover", event =>
            {
                if(randomColorMode)
                    event.target.style.backgroundColor = getRandomColor();
                else if(slowMode) 
                {
                    addPass(event.target);   
                }
                else
                    event.target.style.backgroundColor = drawingColor;
            });
    
            row.appendChild(pixel);
        }
    
        gridContainer.appendChild(row);
    }
}



//color picker logic
let colorPicker = document.querySelector("#color-picker");
let colorPickerWrapper = document.querySelector("#color-picker-wrapper");
colorPicker.addEventListener("change", changeDrawingColor);

function changeDrawingColor(event)
{
    let color = event.target.value;
    drawingColor = switchToRgb(color);
    colorPickerWrapper.style.backgroundColor = drawingColor;
}

colorPickerWrapper.style.backgroundColor = colorPicker.value;

function switchToRgb(color)
{
    let rgbColor = color.slice(1);
    let values = [];
    for(let i = 0; i < 3; i++)
    {
        values[i] = rgbColor.slice(2 * i, 2 + 2 * i);
    }

    
    for(let i = 0; i < values.length; i++)
    {
        values[i] = determineValue(values[i]);
    }

    return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;    
}

function determineValue(value)
{

    let result = 0;
    function determineIndexValue(number, index)
    {
        let indexResult = 0;
        
        switch (number)
        {
            case '0':
                return 0 * (16 ** index);
            case '1':
                return 1 * (16 ** index);
            case '2':
                return 2 * (16 ** index);
            case '3':
                return 3 * (16 ** index);
            case '4':
                return 4 * (16 ** index);
            case '5':
                return 5 * (16 ** index);
            case '6':
                return 6 * (16 ** index);
            case '7':
                return 7 * (16 ** index);
            case '8':
                return 8 * (16 ** index);
            case '9':
                return 9 * (16 ** index);
            case 'a':
                return 10 * (16 ** index);
            case 'b':
                return 11 * (16 ** index);
            case 'c':
                return 12 * (16 ** index);
            case 'd':
                return 13 * (16 ** index);
            case 'e':
                return 14 * (16 ** index);
            case 'f':
                return 15 * (16 ** index);
        }
    }

    result += determineIndexValue(value[0], 1);
    result += determineIndexValue(value[1], 0);
    return result;
}

//buttons logic
let clearBtn = document.querySelector("#clear-btn");
let normalBtn = document.querySelector("#normal-btn");
let randomBtn = document.querySelector("#random");
let slowBtn = document.querySelector("#slow-mode");

clearBtn.onclick = () => {
    unHighLight(slowBtn);
    unHighLight(randomBtn);
    highLight(normalBtn);
    slowMode = false;
    randomColorMode = false;

    //clear the background.
    for(let row of gridContainer.children)
    {
        for(let pixel of row.children)
        {
            pixel.style.backgroundColor = "";
        }
    }
};

normalBtn.onclick = () =>
{
    highLight(normalBtn);
    unHighLight(slowBtn);
    unHighLight(randomBtn);
    
    slowMode = false;
    randomColorMode = false;
}

randomBtn.onclick = () =>
{
    unHighLight(slowBtn);
    unHighLight(normalBtn);

    randomColorMode = !randomColorMode;

    if(randomColorMode)
        highLight(randomBtn);
    else
        unHighLight(randomBtn);

    slowMode = false;
};
function getRandomColor()
{
    return (`rgb(${Math.ceil(Math.random() * 255)}, ${Math.ceil(Math.random() * 255)}, ${Math.ceil(Math.random() * 255)})`);
}


slowBtn.onclick = () =>
{
    unHighLight(randomBtn);
    unHighLight(normalBtn);
    
    slowMode = !slowMode;
    randomColorMode = false;
    if(slowMode)
    {
        highLight(slowBtn);
    }   
    else
    {
        unHighLight(slowBtn);
    }
};
function addPass(target)
{
    let rgbValue = target.style.backgroundColor.slice(3);
    let values = [];
    
    values[0] = rgbValue.slice(1, rgbValue.indexOf(","));
    values[1] = rgbValue.slice(rgbValue.indexOf(",") + 1, rgbValue.lastIndexOf(","));
    values[2] = rgbValue.slice(rgbValue.lastIndexOf(",") + 1, rgbValue.length - 1);

    for(let i = 0; i < 3; i++)
    {
        values[i] = parseInt(values[i]);
        values[i] -= 25;
        if(values[i] < 0)
        {
            values[i] = 0;
        }
    }
    
    target.style.backgroundColor = `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
}


function highLight(target)
{
    
    target.style.backgroundColor = "salmon";
}

function unHighLight(target)
{
    target.style.backgroundColor = "";
}


//slider logic
let sizeParagraph = document.querySelector("#grid-size-display").firstChild;
sizeParagraph.textContent = `${gridSize} x ${gridSize}`;

let slider = document.querySelector("#slider");
slider.addEventListener("change", resetCanvas);

function resetCanvas()
{
    //I am not sure about how memory is managed in JavaScript, so 
    //I deleted each pixel here in its row, then deleted that row after.
    //I could have just deleted the row immediately, but I did it this way.
    for(let i = gridContainer.children.length - 1; i >= 0; i--)
    {
        let row = gridContainer.children[i];
        for(let j = row.children.length - 1; j >= 0; j--)
        {
            row.children[j].remove();
        }

        row.remove();
    }
    setup(slider.value);
    sizeParagraph.textContent = `${gridSize} x ${gridSize}`;

    randomColorMode = false;
    slowMode = false;
    highLight(normalBtn);
    unHighLight(randomBtn);
    unHighLight(slowBtn);
}


setup(slider.value);
highLight(normalBtn);