import { nodeIcons } from "../lib/nodeIcons";
import type { Workflow } from "../types/workflow";
import { ArrowRightIcon } from '@radix-ui/react-icons'; 

export function renderWorkflowSequence(workflow: Workflow) {
  let sequence: string[];
  if(workflow.triggerType==="Webhook") {
  sequence = [workflow.triggerType];
  } else {
     sequence = []
  }

 const visited = new Set();
 let current = Object.keys(workflow.connections)[0];

 while(current && !visited.has(current)) {
    visited.add(current);
    const nodeType = workflow.nodes[current]?.type;
    if(nodeType) sequence.push(nodeType);
    const next = workflow.connections[current]?.[0];
    current = next;
 }

return (
    <div className="flex items-center gap-2">
      <img src={nodeIcons.Workflow} alt="Workflow" className="w-6 h-6" /> <br />
      {sequence.map((type, idx) => (
        <span key={idx} className="flex items-center gap-2 my-2">
          <img src={nodeIcons[type]} alt={type} className="w-6 h-6" />
          {idx < sequence.length - 1 && <ArrowRightIcon />}
        </span>
      ))}
    </div>
  );
}