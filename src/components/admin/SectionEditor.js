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

  const groupByOptions = [
    { label: 'campaignId', value: 'trackingField4' },
    { label: 'clickId', value: 'clickID' },
  ]

  const metricOptions = [
    { label: 'campaignId', value: 'trackingField4' },
    { label: 'clickId', value: 'clickID' },
    { label: 'visits', value: 'visits' },
  ]

  const filterNameOptions = [
    { label: 'campaignId', value: 'trackingField4' },
    { label: 'visits', value: 'visits' },
  ]

  const operatorOptions = ['=', '>', '<', '>=', '<=', 'in', 'like']

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
      if (selectedFilterName === 'visits') {
        parsedFilterValue = parseInt(filterValue, 10)
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

  useEffect(() => {
    if (sectionId === 'new') {
      setIsNewSection(true)
      setEditedSection({
        title: '',
        telegramId: '',
        startDate: null,
        endDate: null,
        sortBy: '',
        metricsFilters: [],
      })
      setSelectedOptions([])
      setSelectedMetrics([])
      setNotificationInterval('')
    } else {
      axios
        .get(`http://localhost:4001/sections/${sectionId}`, {
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
    if (
      editedSection &&
      editedSection.title &&
      editedSection.startDate &&
      editedSection.endDate &&
      // editedSection.groupBy &&
      // editedSection.metrics &&
      editedSection.sortBy &&
      editedSection.telegramId
    ) {
      editedSection.groupByOptions = selectedOptions
      editedSection.metrics = selectedMetrics
      editedSection.notificationInterval = notificationInterval
      if (isNewSection) {
        const formattedStartDate = editedSection.startDate.toISOString()
        const formattedEndDate = editedSection.endDate.toISOString()
        axios
          .post(
            'http://localhost:4001/create',
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
          .put(`http://localhost:4001/section/${sectionId}`, editedSection, {
            withCredentials: true,
          })
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
        .delete(`http://localhost:4001/delete/${sectionId}`, {
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
      const response = await axios.get('http://localhost:4001/sections', {
        withCredentials: true,
      })
      const loadedSections = response.data.sections

      // Обновите состояние хранилища Redux с помощью dispatch
      dispatch(updateSections(loadedSections))
    } catch (error) {
      console.error('Ошибка при загрузке секций', error)
    }
  }

  return (
    <div className="w-full section-editor-container">
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
          <div className="gradient-box">
            <div className="mb-4 gradient-box">
              <label className="block mb-1 font-bold">
                Select GroupBy Metrics:
              </label>
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
          </div>
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
                  <option key={index} value={option}>
                    {option}
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
              Notification Interval (in minutes):
            </label>
            <input
              type="number"
              value={notificationInterval}
              onChange={(e) => setNotificationInterval(e.target.value)}
              className="w-20 p-2 border border-gray-300 rounded-md"
              min="1"
            />
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
