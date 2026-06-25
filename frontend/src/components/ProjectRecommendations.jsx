function ProjectRecommendations({ projects }) {
    const hasProjects = projects && projects.length > 0;

    return (
        <div className="panel">
            <h2 className="panel-title">Projects to build</h2>

            {hasProjects ? (
                <div className="project-list">
                    {projects.map((project, index) => (
                        <div className="project-card" key={index}>
                            <p className="project-title">{project.title}</p>
                            <p className="project-desc">{project.description}</p>
                            {project.skills && project.skills.length > 0 && (
                                <div className="chip-row">
                                    {project.skills.map((skill, i) => (
                                        <span className="chip" key={i}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>No project suggestions available.</p>
                </div>
            )}
        </div>
    );
}

export default ProjectRecommendations;
