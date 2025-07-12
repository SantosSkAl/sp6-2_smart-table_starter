import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

    // const beforeTable = before.map(templateId => cloneTemplate(templateId)).reverse()
    // beforeTable.forEach(tamlpate => root.container.prepend(tamlpate.container))
    // const afterTable = after.map(templateId => cloneTemplate(templateId))
    // afterTable.forEach(tamlpate => root.container.append(tamlpate.container))

    before.reverse().forEach(templateId=> {                  // перебираем нужный массив идентификаторов
        root[templateId] = cloneTemplate(templateId);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[templateId].container);   // добавляем к таблице после (append) или до (prepend)
    });
    after.reverse().forEach(templateId => {
        root[templateId] = cloneTemplate(templateId);
        root.container.append(root[templateId].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    root.container.addEventListener('change', () => onAction())
    // root.container.addEventListener('input', () => onAction())
    root.container.addEventListener('reset', () => setTimeout(onAction))
    root.container.addEventListener('submit', (e) => {
        e.preventDefault()
        onAction(e.submitter)
    })

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate)
            Object.keys(item).forEach(key => {
                if (key in row.elements) row.elements[key].textContent = item[key]
            })
            // console.log(row.elements)
            // при обновлении элементов контейнер тоже обновился?
            return row.container
        });
        // console.log(nextRows)
        root.elements.rows.replaceChildren(...nextRows);
    }
    console.log(root)

    return {...root, render};  // юзаем спред, чтобы добавить метод render к уже существующему обьекту (root) не мутируя его

    // что возвращает:
    // {
    //     container: <HTMLElement>,         // Корневой DOM-элемент таблицы
    //     elements: { rows: <tbody> },      // Словарь внутренних элементов таблицы
    //     header: ...,                      // блок из before
    //     pagination: ...,                  // блок из after
    //     render: function(data) { ... }    // Метод для отрисовки строк
    // }
}