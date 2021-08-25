!macro customUnInstall
  MessageBox MB_YESNO "Supprimer les données enregistrées par l'application ?" \
    /SD IDNO IDNO Skipped IDYES Accepted

  Accepted:
    RMDir /r "$APPDATA\${APP_FILENAME}"
    !ifdef APP_PRODUCT_FILENAME
      RMDir /r "$APPDATA\${APP_PRODUCT_FILENAME}"
    !endif
    Goto done
  Skipped:
    Goto done
  done:
!macroend
