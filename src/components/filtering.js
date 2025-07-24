import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                .map(name => {                        // используйте name как значение и текстовое содержимое
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;   // @todo: создать и вернуть тег опции
                })
        )
      })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const input = action.closest('label').querySelector('input')
            input.value = ''
            const fieldName = action.dataset.field
            state[fieldName] = ''
        }
        // делаем из totalFrom и totalTo (если имеются) массив и сохраняем его с ключом total
        const filterState = { ...state }; // Создаём копию состояния, чтобы не мутировать исходный state
        const from = state.totalFrom
        const to = state.totalTo
        if (from || to) {
            filterState.total = [from ? Number(from) : null, to ? Number(to) : null]
            delete filterState.totalFrom
            delete filterState.totalTo
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, filterState));
        // return data.filter(row => compare(row, state));
        // return data;
    }
}