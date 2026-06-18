from langgraph.graph import StateGraph, END 

from app.graphs.graph_state import GraphState

from app.graphs.nodes.jd_matcher import jd_matcher
from app.graphs.nodes.job_loader import load_job
from app.graphs.nodes.project_recommender import project_recommender
from app.graphs.nodes.resume_loader import load_resume

workflow = StateGraph(GraphState)

#Adding Nodes

workflow.add_node(
    "resume_loader",
    load_resume
)

workflow.add_node(
    "job_loader",
    load_job
)

workflow.add_node(
    "jd_matcher",
    jd_matcher
)

workflow.add_node(
    "project_recommender",
    project_recommender
)

#Adding Edges

workflow.add_edge(
    "resume_loader",
    "job_loader"
)

workflow.add_edge(
    "job_loader",
    "jd_matcher"
)

workflow.add_edge(
    "jd_matcher",
    "project_recommender"
)

workflow.add_edge(
    "project_recommender",
    END
)

#Entry Point
workflow.set_entry_point(
    "resume_loader"
)

graph = workflow.compile()

#SSE

NODE_ORDER = [
    "resume_loader",
    "job_loader",
    "jd_matcher",
    "project_recommender"
]

NODE_LABELS = {
    "resume_loader": "Reading resume",
    "job_loader": "Reading job description",
    "jd_matcher": "Comparing resume to role",
    "project_recommender": "Drafting project ideas"
}