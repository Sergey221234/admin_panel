import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { parseISO } from 'date-fns'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateSections } from '../../redux/sidebarSlice'
import '../../../src/index.css'
import { FaTrash } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import groupByOptions from '../../../src/data/groupByOptions'
import metricOptions from '../../../src/data/metricOptions'
import filterNameOptions from '../../../src/data/filterNameOptions'
import sortByDataOptions from '../../../src/data/sortByOptions'
import timezone from '../../../src/data/timezoneOptions'

const SectionEditor = () => {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedSection, setSelectedSection] = useState(null)
  const [editedSection, setEditedSection] = useState(null)
  const [isNewSection, setIsNewSection] = useState(false)

  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState('')

  const [selectedMetrics, setSelectedMetrics] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('')

  const [selectedFilterName, setSelectedFilterName] = useState('')
  const [filterOperator, setFilterOperator] = useState('')
  const [filterValue, setFilterValue] = useState('')

  const [notificationInterval, setNotificationInterval] = useState(1)

  const [sortByOptions, setSortByOptions] = useState([])
  const [selectedSortBy, setSelectedSortBy] = useState('')

  const [selectedTimezone, setSelectedTimezone] = useState('')

  const operatorOptions = [
    {
      label: 'равно =',
      operator: '=',
    },
    {
      label: 'больше >',
      operator: '>',
    },
    {
      label: 'меньше <',
      operator: '<',
    },
    {
      label: 'равно или больше >=',
      operator: '>=',
    },
    {
      label: 'равно или меньше <=',
      operator: '<=',
    },
    {
      label: 'в in',
      operator: 'in',
    },
    {
      label: 'как like',
      operator: 'like',
    },
  ]

  const sortByWrong = () => {
    toast.error('🦄 Wow so easy!', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    })
  }
  const handleAddOption = () => {
    if (selectedOption && !selectedOptions.includes(selectedOption)) {
      setSelectedOptions([...selectedOptions, selectedOption])
      setSelectedOption('')
    }
  }

  const handleRemoveOption = (optionToRemove) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option !== optionToRemove
    )
    setSelectedOptions(updatedOptions)
  }

  const handleAddMetric = () => {
    if (selectedMetric && !selectedMetrics.includes(selectedMetric)) {
      setSelectedMetrics([...selectedMetrics, selectedMetric])
      setSelectedMetric('')
    }
  }

  const handleRemoveMetric = (optionToRemove) => {
    const updatedMetrics = selectedMetrics.filter(
      (option) => option !== optionToRemove
    )
    setSelectedMetrics(updatedMetrics)
  }

  const handleAddMetricsFilter = () => {
    if (selectedFilterName && filterOperator && filterValue) {
      const selectedFilter = filterNameOptions.find(
        (option) => option.label === selectedFilterName
      )

      let parsedFilterValue = filterValue
      if (
        selectedFilterName === 'visits' ||
        selectedFilterName === 'roi' ||
        selectedFilterName === 'dynamicPayout'
      ) {
        parsedFilterValue = parseInt(filterValue, 10)
        parsedFilterValue = parseFloat(filterValue)
      }

      if (filterOperator === 'in') {
        parsedFilterValue = filterValue.split(',').map((value) => value.trim())
      }

      const newFilter = {
        filterName: selectedFilter ? selectedFilter.value : selectedFilterName,
        filterOperator: filterOperator,
        filterValue: parsedFilterValue,
      }

      setEditedSection((prevSection) => ({
        ...prevSection,
        metricsFilters: [...editedSection.metricsFilters, newFilter],
      }))

      setSelectedFilterName('')
      setFilterOperator('')
      setFilterValue('')
    }
  }

  const handleRemoveMetricsFilter = (index) => {
    // Создаем копию текущего массива metricsFilters
    const updatedFilters = [...editedSection.metricsFilters]

    // Удаляем выбранный фильтр по индексу
    updatedFilters.splice(index, 1)

    // Обновляем состояние editedSection с новым массивом metricsFilters
    setEditedSection((prevSection) => ({
      ...prevSection,
      metricsFilters: updatedFilters,
    }))
  }

  const handleAddSortBy = () => {
    if (selectedSortBy && !sortByOptions.includes(selectedSortBy)) {
      setSortByOptions([...sortByOptions, selectedSortBy]) // Обновляем SortBy как строку, а не как массив
      setSelectedSortBy('')
    } else if (!selectedSortBy) {
      toast.error('Выберите значение в поле SortBy.')
    } else {
      toast.error('Это значение SortBy уже добавлено.')
    }
  }

  const handleRemoveSortBy = (index) => {
    const updatedSortByOptions = [...sortByOptions]
    updatedSortByOptions.splice(index, 1)
    setSortByOptions(updatedSortByOptions)
  }

  function getSortByLabel(value) {
    const selectedOption = sortByDataOptions.find(
      (option) => option.value === value
    )
    return selectedOption ? selectedOption.label : value
  }

  useEffect(() => {
    if (sectionId === 'new') {
      setIsNewSection(true)
      setEditedSection({
        title: '',
        telegramId: '',
        startDate: null,
        endDate: null,
        metricsFilters: [],
      })
      setSelectedOptions([])
      setSelectedMetrics([])
      setNotificationInterval('')
      setSortByOptions([])
      setSelectedTimezone('')
    } else {
      axios
        .get(`https://dash.n2stools.com/api/sections/${sectionId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const sectionData = response.data.section
          sectionData.startDate = parseISO(sectionData.startDate)
          sectionData.endDate = parseISO(sectionData.endDate)
          setSelectedSection(sectionData)
          setEditedSection(sectionData)
          setIsNewSection(false)
          console.log('Полученные опции из бэкенда:', sectionData)
          setNotificationInterval(sectionData.notificationInterval || [])
          setSelectedOptions(sectionData.groupByOptions || [])
          setSelectedMetrics(sectionData.metrics || [])
          setSortByOptions([sectionData.sortBy] || [])
          setSelectedTimezone(sectionData.timezone || [])
        })
        .catch((error) => {
          console.error('Ошибка при загрузке секции', error)
        })
    }
  }, [sectionId])

  const handleFieldChange = (field, value) => {
    const updatedSection = { ...editedSection, [field]: value }
    setEditedSection(updatedSection)
  }

  const handleSaveSection = () => {
    console.log((editedSection.sortBy = sortByOptions))
    if (
      editedSection &&
      editedSection.title &&
      editedSection.startDate &&
      editedSection.endDate &&
      editedSection.sortBy &&
      editedSection.telegramId &&
      notificationInterval
    ) {
      editedSection.groupByOptions = selectedOptions
      editedSection.metrics = selectedMetrics
      editedSection.notificationInterval = notificationInterval
      editedSection.sortBy = sortByOptions[0]
      editedSection.timezone = selectedTimezone
      if (isNewSection) {
        const formattedStartDate = editedSection.startDate.toISOString()
        const formattedEndDate = editedSection.endDate.toISOString()
        axios
          .post(
            'https://dash.n2stools.com/api/create',
            {
              ...editedSection,
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log('Новая секция успешно создана', response.data)
            // После успешного создания, загрузите обновленный список секций

            loadSections()
            navigate('/dashboard')
          })
          .catch((error) => {
            console.error('Ошибка при создании секции', error)
          })
      } else {
        axios
          .put(
            `https://dash.n2stools.com/api/section/${sectionId}`,
            editedSection,
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            console.log('Секция успешно обновлена', response.data.section)
            // После успешного обновления, загрузите обновленный список секций

            loadSections()
            navigate('/dashboard')
          })
          .catch((error) => {
            console.error('Ошибка при обновлении секции', error)
          })
      }
    }
  }

  const handleDeleteSection = () => {
    if (sectionId) {
      axios
        .delete(`https://dash.n2stools.com/api/delete/${sectionId}`, {
          withCredentials: true,
        })
        .then((response) => {
          console.log('Секция успешно удалена')
          // После удаления секции, вы можете выполнить перенаправление на другую страницу
          // или обновить данные в боковой панели.
          loadSections()
          navigate('/dashboard')
        })
        .catch((error) => {
          console.error('Ошибка при удалении секции', error)
        })
    }
  }

  const loadSections = async () => {
    try {
      const response = await axios.get(
        'https://dash.n2stools.com/api/sections',
        {
          withCredentials: true,
        }
      )
      const loadedSections = response.data.sections

      // Обновите состояние хранилища Redux с помощью dispatch
      dispatch(updateSections(loadedSections))
    } catch (error) {
      console.error('Ошибка при загрузке секций', error)
    }
  }

  return (
    <div className="w-full section-editor-container">
      <ToastContainer />
      <h1>Rule Editor</h1>
      {selectedSection || isNewSection ? (
        <div>
          <div className="mb-4">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              value={editedSection.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {!editedSection.title && (
              <p className="text-red-500">Поле Name не может быть пустым</p>
            )}
          </div>
          <div className="m">Интервал исследование:</div>
          <div className="mb-4 flex">
            <div className="mr-2">
              <label className="block mb-1">Start Date and Time:</label>
              <DatePicker
                selected={editedSection.startDate}
                onChange={(date) => handleFieldChange('startDate', date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {!editedSection.startDate && (
                <p className="text-red-500">
                  Start Date and Time не может быть пустым
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1">End Date and Time:</label>
              <DatePicker
                selected={editedSection.endDate}
                onChange={(date) => handleFieldChange('endDate', date)}
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm:ss"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {!editedSection.endDate && (
                <p className="text-red-500">
                  End Date and Time не может быть пустым
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Select Timezone:</label>
            <select
              className="select-input"
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              <option value="">Select a timezone</option>
              {timezone.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="gradient-box">
            <div className="mb-4 gradient-box">
              <label className="block mb-1 font-bold">
                Select GroupBy Metrics:
              </label>
              <span>MIN: 1 metric, MAX: 10 metrics</span>
              <select
                className="select-input"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="">Select a metric</option>
                {groupByOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="add-button" onClick={handleAddOption}>
                Add
              </button>
            </div>
            <div>
              <h2 className="font-bold">Selected GroupBy Metrics:</h2>
              <ul className="options-list">
                {selectedOptions.map((option, index) => {
                  const selectedOptionLabel = groupByOptions.find(
                    (item) => item.value === option
                  )?.label

                  return (
                    <li className="option-item" key={index}>
                      {selectedOptionLabel || option}{' '}
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveOption(option)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="gradient-box2 mt-2">
            <div className="mb-4">
              <label className="block mb-1 font-bold">Select Metrics:</label>
              <span>MIN: 3 metrics</span>
              <select
                className="select-input"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                <option value="">Select a metric</option>
                {metricOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="add-button" onClick={handleAddMetric}>
                Add
              </button>
            </div>
            <div>
              <h2 className="font-bold">Selected Metrics:</h2>
              <ul className="options-list">
                {selectedMetrics.map((option, index) => {
                  const selectedMetricLabel = metricOptions.find(
                    (item) => item.value === option
                  )?.label

                  return (
                    <li className="option-item" key={index}>
                      {selectedMetricLabel || option}{' '}
                      <button
                        className="remove-button"
                        onClick={() => handleRemoveMetric(option)}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-bold">Select SortBy:</label>
            <span>
              Name of the metric you want to sort by your data. NOTE: Column
              selected to sort should be inside metrics
            </span>
            <select
              className="select-input"
              value={selectedSortBy}
              onChange={(e) => setSelectedSortBy(e.target.value)}
            >
              <option value="">Select a metric</option>
              {sortByDataOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button className="add-button" onClick={handleAddSortBy}>
              Add SortBy
            </button>
          </div>
          <div>
            <h2 className="font-bold">Selected SortBy:</h2>
            <ul className="options-list">
              {sortByOptions.map((option, index) => (
                <li className="option-item" key={index}>
                  {getSortByLabel(option)}{' '}
                  {/* Используйте функцию для отображения label */}
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveSortBy(index)}
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="mb-4">
            <label className="block mb-1">sortBy:</label>
            <input
              value={editedSection.sortBy}
              onChange={(e) => handleFieldChange('sortBy', e.target.value)}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder="Name of the metric you want to sort by your data. NOTE: Column selected to sort should be inside metrics"
            />
            {!editedSection.sortBy && (
              <p className="text-red-500">Поле sortBy не может быть пустым</p>
            )}
          </div> */}
          <div className="gradient-box">
            <h2 className="font-bold">Select Metrics Filters:</h2>
            <span>MIN: 1 metric</span>
            <div className="mb-4">
              <label className="block mb-1">Filter Name:</label>
              <select
                className="select-input"
                value={selectedFilterName}
                onChange={(e) => setSelectedFilterName(e.target.value)}
              >
                <option value="">Select a filter name</option>
                {filterNameOptions.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Operator:</label>
              <select
                className="select-input"
                value={filterOperator}
                onChange={(e) => setFilterOperator(e.target.value)}
              >
                <option value="">Select an operator</option>
                {operatorOptions.map((option, index) => (
                  <option key={index} value={option.operator}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Filter Value:</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button className="add-button" onClick={handleAddMetricsFilter}>
              Add Filter
            </button>
            <h2 className="font-bold">Selected Metrics Filters:</h2>
            <ul className="options-list">
              {editedSection.metricsFilters.map((filter, index) => {
                const selectedFilterLabel = filterNameOptions.find(
                  (option) => option.value === filter.filterName
                )?.label

                return (
                  <li className="option-item" key={index}>
                    {selectedFilterLabel || filter.filterName}{' '}
                    {filter.filterOperator} {filter.filterValue}{' '}
                    <button
                      className="remove-button"
                      onClick={() => handleRemoveMetricsFilter(index)}
                    >
                      <FaTrash />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="mb-4">
            <label className="block mb-1">
              Интервал оповещения (в минутах):
            </label>
            <input
              type="number"
              value={notificationInterval}
              onChange={(e) => setNotificationInterval(e.target.value)}
              className="w-20 p-2 border border-gray-300 rounded-md"
              min="1"
            />
            {!notificationInterval && (
              <p className="text-red-500">
                Поле Интервал оповещения не может быть пустым
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">telegramId:</label>
            <input
              type="text"
              value={editedSection.telegramId}
              onChange={(e) => handleFieldChange('telegramId', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {!editedSection.telegramId && (
              <p className="text-red-500">
                Поле telegramId не может быть пустым
              </p>
            )}
          </div>
          <button
            onClick={handleSaveSection}
            className="bg-blue-500 text-white px-2 py-1 rounded mt-4 hover:bg-blue-600"
          >
            {isNewSection ? 'Create' : 'Update'}
          </button>
          {!isNewSection && (
            <button
              onClick={handleDeleteSection}
              className="bg-red-500 text-white px-2 py-1 rounded mt-4 ml-2 hover:bg-red-600"
            >
              Delete
            </button>
          )}
        </div>
      ) : (
        <div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  )
}

export default SectionEditor
