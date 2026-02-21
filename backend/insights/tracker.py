# Tracker for insights
# backend/insights/tracker.py

from collections import Counter


class InsightTracker:
    """
    Tracks lightweight session insights.
    """

    def __init__(self):
        self.total_questions = 0
        self.topic_frequency = Counter()
        self.explanation_modes = Counter()

    def log_question(self, question: str, mode: str):
        self.total_questions += 1
        # Extract meaningful keywords for topics
        keywords = [w for w in question.lower().split() if len(w) > 3]
        for word in keywords[:5]:
            self.topic_frequency[word] += 1
        self.explanation_modes[mode] += 1

    def get_insights(self):
        # Format for frontend expectations
        return {
            "total_questions": self.total_questions,
            "top_topics": [
                {"topic": t.capitalize(), "count": c} 
                for t, c in self.topic_frequency.most_common(5)
            ],
            "mode_usage": dict(self.explanation_modes),
        }


insight_tracker = InsightTracker()