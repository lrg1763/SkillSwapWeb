'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface AccordionItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}

function AccordionItem({ question, answer, isOpen, onToggle }: AccordionItemProps) {
  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:15',message:'AccordionItem render',data:{question:question.substring(0,30),isOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C'})}).catch(()=>{});
  // #endregion

  const handleClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:17',message:'Button click handler called',data:{isOpenBefore:isOpen},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    onToggle()
  }

  return (
    <div className="border-b-2 border-primary-gray-medium last:border-b-0">
      <button
        onClick={handleClick}
        className="w-full py-6 flex items-center justify-between hover:bg-primary-gray-light transition-colors rounded-lg px-4"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl font-onyx-black pr-4 text-center md:text-left flex-1">{question}</span>
        <div className="w-8 h-8 rounded-full bg-primary-black flex items-center justify-center flex-shrink-0">
          {isOpen ? (
            <X className="h-5 w-5 text-primary-white transition-opacity duration-200" />
          ) : (
            <Plus className="h-5 w-5 text-primary-white transition-opacity duration-200" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-6 px-4">
          {/* #region agent log */}
          {(() => { fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:37',message:'Answer content rendering',data:{answerLength:answer.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{}); return null; })()}
          {/* #endregion */}
          <p className="text-primary-gray-text font-onyx-regular leading-relaxed text-center md:text-left">
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}

interface AccordionProps {
  items: Array<{ question: string; answer: string }>
  defaultOpenIndex?: number
}

export default function Accordion({ items, defaultOpenIndex = 0 }: AccordionProps) {
  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:48',message:'Accordion component mount',data:{itemsCount:items.length,defaultOpenIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:52',message:'State initialized',data:{openIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const handleToggle = (index: number) => {
    // #region agent log
    fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:56',message:'handleToggle called',data:{index,currentOpenIndex:openIndex,willClose:openIndex===index},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    const newOpenIndex = openIndex === index ? null : index
    
    // #region agent log
    fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:62',message:'Before setOpenIndex',data:{oldOpenIndex:openIndex,newOpenIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    
    setOpenIndex(newOpenIndex)
    
    // #region agent log
    fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:66',message:'After setOpenIndex call',data:{newOpenIndex},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
  }

  // #region agent log
  fetch('http://127.0.0.1:7250/ingest/9fb6c82f-66a0-462a-b7f7-74dfc935103b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Accordion.tsx:71',message:'Accordion render',data:{openIndex,itemsCount:items.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  return (
    <div className="space-y-0">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  )
}
