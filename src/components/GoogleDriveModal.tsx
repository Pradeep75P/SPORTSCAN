import React, { useState, useEffect } from 'react';
import { 
  X, HardDrive, UploadCloud, FileText, CheckCircle2, 
  Trash2, ExternalLink, RefreshCw, AlertTriangle, ShieldCheck,
  UserCheck, Sparkles, FolderPlus
} from 'lucide-react';
import { 
  googleSignIn, 
  googleLogout, 
  getAccessToken, 
  listDriveFiles, 
  uploadReportToDrive, 
  deleteDriveFile, 
  DriveFile 
} from '../lib/googleDrive';
import { User as FirebaseUser } from 'firebase/auth';
import { Assessment, AthleteProfile } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessmentToExport?: Assessment | null;
  athleteToExport?: AthleteProfile | null;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  assessmentToExport,
  athleteToExport
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Confirmation dialog state for file deletion (Destructive operation requirement)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setAccessToken(token);
      fetchDriveFiles(token);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setStatusMessage({ type: 'success', text: `Signed in as ${res.user.email}. Connected to Google Drive!` });
        await fetchDriveFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error('Drive auth failed:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Google Drive authentication failed.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await googleLogout();
    setCurrentUser(null);
    setAccessToken(null);
    setFiles([]);
    setStatusMessage({ type: 'info', text: 'Disconnected from Google Drive.' });
  };

  const fetchDriveFiles = async (token: string) => {
    setIsLoadingFiles(true);
    try {
      const driveFiles = await listDriveFiles(token);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Fetch Drive files error:', err);
      setStatusMessage({ type: 'error', text: 'Could not fetch Google Drive files.' });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleExportAssessment = async () => {
    if (!accessToken || !assessmentToExport) return;
    setIsUploading(true);
    setStatusMessage(null);

    const fileName = `SportScan_Assessment_${assessmentToExport.athleteName.replace(/\s+/g, '_')}_${assessmentToExport.testType}.json`;
    const content = JSON.stringify({
      appName: 'SportScan AI',
      generatedAt: new Date().toISOString(),
      athlete: assessmentToExport.athleteName,
      testType: assessmentToExport.testType,
      overallScore: assessmentToExport.overallScore,
      biomechanicsScore: assessmentToExport.biomechanicsScore,
      metrics: assessmentToExport.metrics,
      aiFeedback: assessmentToExport.aiFeedback,
      cheatingValidation: assessmentToExport.cheatingValidation
    }, null, 2);

    try {
      const uploadedFile = await uploadReportToDrive(accessToken, fileName, content, 'application/json');
      setStatusMessage({ 
        type: 'success', 
        text: `Exported assessment report "${uploadedFile.name}" to Google Drive successfully!` 
      });
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to upload report to Google Drive.' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExportAthleteCard = async () => {
    if (!accessToken || !athleteToExport) return;
    setIsUploading(true);
    setStatusMessage(null);

    const fileName = `SportScan_ScoutCard_${athleteToExport.name.replace(/\s+/g, '_')}.json`;
    const content = JSON.stringify({
      appName: 'SportScan AI - Verified Scout Card',
      exportedAt: new Date().toISOString(),
      athleteProfile: {
        id: athleteToExport.id,
        name: athleteToExport.name,
        sport: athleteToExport.sport,
        location: athleteToExport.location,
        verifiedScore: athleteToExport.overallScore,
        speedScore: athleteToExport.speedScore,
        agilityScore: athleteToExport.agilityScore,
        enduranceScore: athleteToExport.enduranceScore,
        aiAssessmentSummary: athleteToExport.aiAssessmentSummary,
        cheatingCheckPassed: athleteToExport.cheatingCheckPassed
      }
    }, null, 2);

    try {
      const uploadedFile = await uploadReportToDrive(accessToken, fileName, content, 'application/json');
      setStatusMessage({ 
        type: 'success', 
        text: `Exported scout card "${uploadedFile.name}" to Google Drive successfully!` 
      });
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to export scout card to Google Drive.' });
    } finally {
      setIsUploading(false);
    }
  };

  const confirmDeleteFile = async () => {
    if (!accessToken || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, fileToDelete.id);
      setStatusMessage({ type: 'success', text: `Deleted "${fileToDelete.name}" from Google Drive.` });
      setFileToDelete(null);
      fetchDriveFiles(accessToken);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to delete file from Google Drive.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0c]/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141418] border border-white/10 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1c1c22] transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Google Drive Cloud Sync
            </h3>
            <p className="text-xs text-slate-400">
              Backup & export kinetic AI assessment reports and athlete scout cards directly to your Google Drive
            </p>
          </div>
        </div>

        {/* Alert Banner */}
        {statusMessage && (
          <div className={`p-3 rounded-xl mb-4 text-xs flex items-center gap-2 border ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : statusMessage.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
          }`}>
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* SIGN IN STATE / UNAUTHENTICATED */}
        {!accessToken ? (
          <div className="text-center py-8 bg-[#0a0a0c] rounded-2xl border border-white/5 p-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Connect Your Google Account</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Sign in with Google to grant permission for SportScan AI to save verified performance files directly to your Drive storage.
              </p>
            </div>

            {/* Official GSI Material Button */}
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="group relative inline-flex items-center justify-center gap-3 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-lg text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                <span>{isLoggingIn ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATED DRIVE DASHBOARD */
          <div className="space-y-5">
            {/* Connected User Header */}
            <div className="p-3 bg-[#0a0a0c] rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-tight">
                    {currentUser?.displayName || currentUser?.email || 'Google Drive Connected'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">Google Drive Access Granted</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-2.5 py-1 bg-[#1c1c22] hover:bg-[#25252d] text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded border border-white/10 cursor-pointer transition"
              >
                Disconnect
              </button>
            </div>

            {/* Quick Export Actions */}
            {(assessmentToExport || athleteToExport) && (
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Pending File Export
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {assessmentToExport && (
                    <button
                      onClick={handleExportAssessment}
                      disabled={isUploading}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 cursor-pointer transition shadow-md shadow-cyan-500/20 disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {isUploading ? 'Uploading Report...' : `Export ${assessmentToExport.testType} Report to Drive`}
                    </button>
                  )}

                  {athleteToExport && (
                    <button
                      onClick={handleExportAthleteCard}
                      disabled={isUploading}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 cursor-pointer transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                    >
                      <UploadCloud className="w-4 h-4" />
                      {isUploading ? 'Uploading Card...' : `Export Scout Card (${athleteToExport.name}) to Drive`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Drive Files List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Your Google Drive Files ({files.length})
                </h4>
                <button
                  onClick={() => accessToken && fetchDriveFiles(accessToken)}
                  className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoadingFiles ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              {isLoadingFiles ? (
                <div className="py-8 text-center text-xs text-slate-500 animate-pulse">
                  Loading files from Google Drive...
                </div>
              ) : files.length === 0 ? (
                <div className="py-8 text-center bg-[#0a0a0c] rounded-xl border border-white/5 text-xs text-slate-500">
                  No files found in Google Drive. Click export above to save your first AI report!
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-[#0a0a0c] hover:bg-[#141418] border border-white/5 rounded-xl flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-bold text-white truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono truncate">{file.mimeType}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {file.webViewLink && (
                          <a
                            href={file.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-cyan-400 transition"
                            title="Open in Google Drive"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={() => setFileToDelete(file)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Delete File from Drive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DESTRUCTIVE CONFIRMATION DIALOG (Mandatory workspace integration pattern) */}
        {fileToDelete && (
          <div className="absolute inset-0 bg-[#0a0a0c]/95 rounded-2xl z-10 p-6 flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Confirm Google Drive Deletion</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Are you sure you want to delete <span className="text-white font-bold">{fileToDelete.name}</span> from your Google Drive account? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 bg-[#1c1c22] hover:bg-[#25252d] text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer shadow-md shadow-rose-500/20 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete File'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
