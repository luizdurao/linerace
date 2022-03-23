from video import Video

videos_dict = {
    "70 years of Disease Research" : "6z9_fjCuQtE",
    "Research on Infectious Diseases": "HorIC7mZsYY",
    "Research on Inflammatory/Chronic/Auto-Immune Diseases": "A8QvX1lo6hQ",
    "Research on Psychiatric and Neurological Diseases": "dAQv_CVC6TM",
    "Research Associated to Human Genes": "2lpVFoiAu_0",
    "Research Terms in Science AAAS Journal": "NP75mH3YU2Y",
    "Research on Infectious Diseases (no HIV/TB)": "V5vzzzLJwUo",
    "Research on Psychiatric and Neurological Diseases (no S.A.D.)": "5LZ5Nmtk9us",
    "Research Associated to Genes": "6US99_CD1XI",
}


def get_videos():
    videos = []

    for key, value in videos_dict.items():
        vid = Video()
        vid.title = key
        vid.url_id = value

        videos.append(vid)

    return videos
