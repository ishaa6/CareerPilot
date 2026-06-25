from app.db.models import AnalysisHistory

def delete_analysis_by_id(db, analysis_id):
    record = db.query(AnalysisHistory).filter(AnalysisHistory.id == analysis_id).first()

    if not record:
        return False
    
    db.delete(record)
    db.commit()

    return True