import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from './Sidebar'
import SectionEditor from './SectionEditor'

const Section = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Routes>
        <Route
          path="/"
          element={<h1>Select a rule from the sidebar or create a new one.</h1>}
        />
        <Route path="/:sectionId" element={<SectionEditor />} />
        <Route path="/dashboard/new" element={<SectionEditor />} />
      </Routes>
    </div>
  )
}

export default Section
