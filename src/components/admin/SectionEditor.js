import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { parseISO } from 'date-fns'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { updateSections } from '../../redux/sidebarSlice'

const SectionEditor = () => {
  const { sectionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedSection, setSelectedSection] = useState(null)
  const [editedSection, setEditedSection] = useState(null)
  const [isNewSection, setIsNewSection] = useState(false)

  useEffect(() => {
    if (sectionId === 'new') {
      setIsNewSection(true)
      setEditedSection({
        title: '',
        campaignId: '',
        telegramId: '',
        startDate: null,
        endDate: null,
        groupBy: '',
      })
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
        })
        .catch((error) => {
          console.error('Ошибка при загрузке секции', error)
        })
    }
  }, [sectionId])

  const handleFieldChange = (field, value) => {
    let updatedValue = value
    if (field === 'groupBy') {
      updatedValue = value.split(',')
      console.log(updatedValue)
    }
    const updatedSection = { ...editedSection, [field]: value }
    setEditedSection(updatedSection)
  }

  const handleSaveSection = () => {
    if (
      editedSection &&
      editedSection.title &&
      editedSection.startDate &&
      editedSection.endDate &&
      editedSection.groupBy &&
      editedSection.campaignId &&
      editedSection.telegramId
    ) {
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
    <div className="w-full">
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
          <div className="mb-4">
            <label className="block mb-1">groupBy:</label>
            <input
              value={editedSection.groupBy}
              onChange={(e) => handleFieldChange('groupBy', e.target.value)}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
              placeholder="Array of metrics available to group report data. MIN: 1 metric, MAX: 10 metrics"
            />
            {!editedSection.groupBy && (
              <p className="text-red-500">Поле groupBy не может быть пустым</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-1">campaignId:</label>
            <input
              value={editedSection.campaignId}
              onChange={(e) => handleFieldChange('campaignId', e.target.value)}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            {!editedSection.campaignId && (
              <p className="text-red-500">
                Поле campaignId не может быть пустым
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
